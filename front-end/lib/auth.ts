import { apiClient } from './api';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    createdAt: Date;
    lastLogin?: Date;
    // Profile fields
    profileImage?: string;
    address?: string;
    phone?: string;
    bio?: string;
    // Team fields
    teamId?: string;
    teamRole?: string;
    onboardingCompleted?: boolean;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export interface LoginResponse {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        createdAt: string;
        lastLogin: string | null;
    };
    token: string;
}

export interface RegisterResponse {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        createdAt: string;
        lastLogin: string | null;
    };
    token: string;
}

export interface ApiUser {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
    last_login_at: string | null;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    joined_at: Date;
}

export interface ProjectWithTeam {
    id: string;
    name: string;
    description: string;
    status: string;
    color: string;
    progress: number;
    members_count: number;
    members: TeamMember[];
    owner?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface UserWithTeams {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    created_at: Date;
    last_login_at?: Date;
    owned_projects: ProjectWithTeam[];
    member_projects: ProjectWithTeam[];
    total_projects: number;
}

export interface TeamStats {
    total_users: number;
    total_projects: number;
    total_team_members: number;
    projects_with_teams: number;
    users_in_teams: number;
    average_team_size: number;
}

export class AuthService {
    private static instance: AuthService;
    private currentUser: User | null = null;

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private transformUser(apiUser: any): User {
        return {
            id: apiUser.id.toString(),
            email: apiUser.email,
            name: apiUser.name,
            role: apiUser.role as 'user' | 'admin',
            createdAt: new Date(apiUser.createdAt || apiUser.created_at),
            lastLogin: apiUser.lastLogin || apiUser.last_login_at ? new Date(apiUser.lastLogin || apiUser.last_login_at) : undefined,
        };
    }

    async login(
        email: string,
        password: string,
    ): Promise<{ success: boolean; user?: User; error?: string }> {
        try {
            const response = await apiClient.post<LoginResponse>('/auth/login', {
                email,
                password,
            });

            const user = this.transformUser(response.user);
            this.currentUser = user;

            // Store token and user in localStorage
            apiClient.setAuthToken(response.token);
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(user));
            }

            return { success: true, user };
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Login failed' 
            };
        }
    }

    async register(
        email: string,
        password: string,
        name: string,
    ): Promise<{ success: boolean; user?: User; error?: string }> {
        try {
            const response = await apiClient.post<RegisterResponse>('/auth/register', {
                name,
                email,
                password,
            });

            const user = this.transformUser(response.user);
            this.currentUser = user;

            // Store token and user in localStorage
            apiClient.setAuthToken(response.token);
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(user));
            }

            return { success: true, user };
        } catch (error) {
            console.error('Registration error:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Registration failed' 
            };
        }
    }

    async logout(): Promise<void> {
        try {
            // Call logout endpoint to invalidate token on server
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
            // Continue with local logout even if server call fails
        }

        this.currentUser = null;
        apiClient.removeAuthToken();
    }

    getCurrentUser(): User | null {
        if (this.currentUser) {
            return this.currentUser;
        }

        // Try to restore from localStorage
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('user');
            if (stored) {
                try {
                    const user = JSON.parse(stored);
                    // Transform stored user to ensure Date objects
                    this.currentUser = {
                        ...user,
                        createdAt: new Date(user.createdAt),
                        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
                    };
                    return this.currentUser;
                } catch {
                    localStorage.removeItem('user');
                    apiClient.removeAuthToken();
                }
            }
        }

        return null;
    }

    async fetchCurrentUser(): Promise<User | null> {
        try {
            const response = await apiClient.get<{ user: any }>('/auth/user');
            const user = this.transformUser(response.user);
            this.currentUser = user;
            
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(user));
            }
            
            return user;
        } catch (error) {
            console.error('Failed to fetch current user:', error);
            // If token is invalid, clear local storage
            this.currentUser = null;
            apiClient.removeAuthToken();
            return null;
        }
    }

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user?.role === 'admin';
    }

    // Admin functions
    async getAllUsers(): Promise<User[]> {
        try {
            const response = await apiClient.get<ApiUser[]>('/admin/users');
            return response.map(user => this.transformUser(user));
        } catch (error) {
            console.error('Failed to fetch users:', error);
            throw error;
        }
    }

    async createUser(userData: { name: string; email: string; password: string; role: 'user' | 'admin' }): Promise<User> {
        try {
            const response = await apiClient.post<{ user: ApiUser; message: string }>('/admin/users', userData);
            return this.transformUser(response.user);
        } catch (error) {
            console.error('Failed to create user:', error);
            throw error;
        }
    }

    async deleteUser(userId: string): Promise<boolean> {
        try {
            await apiClient.delete(`/admin/users/${userId}`);
            return true;
        } catch (error) {
            console.error('Failed to delete user:', error);
            return false;
        }
    }

    async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<boolean> {
        try {
            await apiClient.put(`/admin/users/${userId}/role`, { role });
            return true;
        } catch (error) {
            console.error('Failed to update user role:', error);
            return false;
        }
    }

    async getUsersWithTeams(): Promise<UserWithTeams[]> {
        try {
            const response = await apiClient.get<any[]>('/admin/users-with-teams');
            return response.map(user => ({
                ...user,
                created_at: new Date(user.created_at),
                last_login_at: user.last_login_at ? new Date(user.last_login_at) : undefined,
                owned_projects: user.owned_projects.map((project: any) => ({
                    ...project,
                    members: project.members.map((member: any) => ({
                        ...member,
                        joined_at: new Date(member.joined_at),
                    })),
                })),
            }));
        } catch (error) {
            console.error('Failed to fetch users with teams:', error);
            throw error;
        }
    }

    async getTeamStats(): Promise<TeamStats> {
        try {
            const response = await apiClient.get<TeamStats>('/admin/team-stats');
            return response;
        } catch (error) {
            console.error('Failed to fetch team stats:', error);
            throw error;
        }
    }
}