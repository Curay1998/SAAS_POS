# Project TODO

Below is an up-to-date overview of the implemented and pending features for both the back-end (Laravel API) and front-end (Next.js) parts of the Sticky-Notes SaaS.

## Back-end (Laravel API)

### ✅ Completed
- [x] Authentication: register, login, logout, fetch current user
- [x] Sticky Notes CRUD endpoints
- [x] Projects CRUD endpoints with plan-based project limit middleware
- [x] Tasks CRUD endpoints
- [x] Public plan catalogue endpoints
- [x] Subscription management: subscribe, checkout session, confirm checkout, start trial, change plan, cancel
- [x] Subscription status endpoint
- [x] Admin user management (list, create, view, update role, delete)
- [x] Admin plan management (create/update/delete, toggle status/archive, sync with Stripe)
- [x] Team reporting endpoints (`users-with-teams`, `team-stats`)
- [x] Stripe webhook endpoint for subscription lifecycle events (`/stripe/webhook` handled by Cashier)



---

## Front-end (Next.js)

### ✅ Completed
- [x] Authentication pages (login / register)
- [x] Global layout, navigation & theming (Tailwind + shadcn/ui)
- [x] Dashboard with sticky-note board
- [x] Project list & details pages
- [x] Task list & management UI
- [x] Subscription & plan checkout flow
- [x] Admin section: dashboard, user management, plan management & settings
- [x] ProfileSettingsTab – load & update user profile via API
- [x] Profile image upload functionality

### 📝 Pending Tasks (by Role & Feature)

#### Customer
- **Profile**
  - [x] Backend: User profile update endpoint (name / email)
- **Security**
  - [ ] Backend: Change-password endpoint
  - [ ] Backend: Email verification & password-reset flows
  - [ ] Frontend: SecuritySettingsTab – change password integration
- **Notifications**
  - [ ] Backend: Notification preferences endpoints (enable/disable, channels)
  - [ ] Frontend: NotificationSettingsTab – load & save notification preferences
  - [ ] Frontend: Global toast / notification system for API feedback
- **Subscription & Trial**
  - [ ] Frontend: TrialStatus component – fetch `/subscription/status` and display trial info
- **User Experience**
  - [ ] Frontend: Responsive/mobile design audit & fixes
  - [ ] Frontend: Consistent loading & error skeletons across pages
  - [ ] System: Performance optimisation (code-splitting, bundle analysis)

#### Admin
- **Team Management**
  - [ ] Backend: Team member management endpoints (invite / add / remove members)
  - [ ] Frontend: UsersTab – invite / remove team members UI
- **Quality Assurance**
  - [ ] Backend: Automated test coverage (PHPUnit & feature tests)
  - [ ] Frontend: Unit & integration tests (Jest/RTL + Cypress)

---

_Keep this list current. Mark items with `[x]` when complete and add new tasks as needed._