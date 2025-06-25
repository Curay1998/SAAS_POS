'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import AccountStep from './AccountStep';
import TeamStep from './TeamStep';
import ProfileStep from './ProfileStep';

interface WizardStep {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
}

interface SignupWizardProps {
    onComplete: (data: SignupData) => void;
}

export interface SignupData {
    // Account data
    name: string;
    email: string;
    password: string;
    // Team data
    teamName: string;
    teamDescription: string;
    teamRole: string;
    inviteEmails: string[];
    // Profile data
    profileImage: string;
    address: string;
    phone: string;
    bio: string;
}

export default function SignupWizard({ onComplete }: SignupWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [wizardData, setWizardData] = useState<SignupData>({
        name: '',
        email: '',
        password: '',
        teamName: '',
        teamDescription: '',
        teamRole: 'owner',
        inviteEmails: [],
        profileImage: '',
        address: '',
        phone: '',
        bio: ''
    });

    const steps: WizardStep[] = [
        {
            id: 'account',
            title: 'Create Account',
            description: 'Basic account information',
            isCompleted: currentStep > 0
        },
        {
            id: 'team',
            title: 'Setup Team',
            description: 'Create your team and invite members',
            isCompleted: currentStep > 1
        },
        {
            id: 'profile',
            title: 'Complete Profile',
            description: 'Add your personal information',
            isCompleted: currentStep > 2
        }
    ];

    const updateWizardData = (data: Partial<SignupData>) => {
        setWizardData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        onComplete(wizardData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8">
                {/* Header */}
                <div>
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">TF</h1>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Welcome to TaskFlow
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Let&apos;s get you set up in just a few steps
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <nav aria-label="Progress">
                            {/* Steps for medium screens and up (horizontal) */}
                            <ol className="hidden sm:flex items-center justify-between">
                                {steps.map((step, index) => (
                                    <li key={`${step.id}-desktop`} className="relative flex-1 last:flex-none">
                                        <div className="flex items-center">
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                                index === currentStep
                                                    ? 'border-blue-600 bg-blue-600 text-white'
                                                    : step.isCompleted
                                                    ? 'border-green-600 bg-green-600 text-white'
                                                    : 'border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                            }`}>
                                                {step.isCompleted ? (
                                                    <CheckCircle className="w-6 h-6" />
                                                ) : (
                                                    <span className="text-sm font-medium">{index + 1}</span>
                                                )}
                                            </div>
                                            <div className="ml-4 min-w-0">
                                                <p className={`text-sm font-medium ${
                                                    index === currentStep
                                                        ? 'text-blue-600 dark:text-blue-400'
                                                        : step.isCompleted
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                    {step.title}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 -z-10">
                                                <div className={`ml-[calc(2.5rem+1rem)] mr-[calc(50%+1rem)] h-1 rounded-full ${ // 2.5rem is icon width, 1rem is ml-4. Adjust mr to connect properly
                                                    step.isCompleted
                                                        ? 'bg-green-600'
                                                        : 'bg-gray-200 dark:bg-gray-600'
                                                }`} />
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ol>
                            {/* Steps for small screens (vertical) */}
                            <ol className="sm:hidden space-y-4">
                                {steps.map((step, index) => (
                                    <li key={`${step.id}-mobile`} className="flex items-start">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mr-3 flex-shrink-0 ${
                                            index === currentStep
                                                ? 'border-blue-600 bg-blue-600 text-white'
                                                : step.isCompleted
                                                ? 'border-green-600 bg-green-600 text-white'
                                                : 'border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                        }`}>
                                            {step.isCompleted ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <span className="text-xs font-medium">{index + 1}</span>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-sm font-medium ${
                                                index === currentStep
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : step.isCompleted
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {step.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        {currentStep === 0 && (
                            <AccountStep 
                                data={wizardData} 
                                onUpdate={updateWizardData} 
                                onNext={nextStep}
                            />
                        )}
                        {currentStep === 1 && (
                            <TeamStep 
                                data={wizardData} 
                                onUpdate={updateWizardData} 
                                onNext={nextStep}
                                onPrev={prevStep}
                            />
                        )}
                        {currentStep === 2 && (
                            <ProfileStep 
                                data={wizardData} 
                                onUpdate={updateWizardData} 
                                onComplete={handleComplete}
                                onPrev={prevStep}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

