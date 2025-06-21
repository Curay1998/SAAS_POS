# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack SaaS sticky note application with:
- **Backend**: Laravel 12.0 API with Stripe integration (Laravel Cashier)
- **Frontend**: Next.js 14+ with TypeScript and shadcn/ui components
- **Database**: SQLite (development), configurable for production
- **Authentication**: Laravel Sanctum token-based API authentication
- **Subscriptions**: Multi-tier plans with trial support and feature limits

## Development Commands

### Backend (Laravel)
- `composer dev` - Starts complete development environment (server, queue, logs, Vite)
- `composer test` - Run PHPUnit test suite
- `php artisan migrate` - Run database migrations
- `php artisan sync:plans-with-stripe` - Sync subscription plans with Stripe

### Frontend (Next.js)
- `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`) - Development server
- `npm run build` - Production build
- `npm run lint` - ESLint checking

## Architecture

### Backend Structure
- **API-first design** with `/api/v1/` versioning
- **Service layer**: `StripeService` handles all Stripe operations
- **Custom middleware**: `AdminMiddleware`, `PlanLimitMiddleware`, `TrialExpiredMiddleware`
- **Role-based access**: Admin vs customer routes and permissions

### Frontend Structure
- **App directory structure** (Next.js 14+)
- **Role-based layouts**: `AdminLayout` and `CustomerLayout`
- **Global auth state**: `AuthContext` with `ApiClient` for backend communication
- **Separate admin and customer interfaces** under `/admin/` and `/customer/` routes

### Key Models & Relationships
- `User` belongs to `Plan`, has many `Projects` and `StickyNotes`
- `Project` has many `Tasks` and `StickyNotes`, belongs to many `Users` (via `ProjectMember`)
- `Plan` has configurable limits (projects, storage, users) and trial settings
- Stripe integration via Laravel Cashier (`subscriptions`, `subscription_items` tables)

## Database
- **Development**: SQLite database at `back-end/database/database.sqlite`
- **Testing**: In-memory SQLite (configured in phpunit.xml)
- **Migrations**: Include subscription tables, plan limits, and trial features

## Testing
- **Backend**: PHPUnit with feature tests for Stripe integration using real test environment
- **Test files**: Located in `back-end/tests/Feature/` and `back-end/tests/Unit/`
- **Stripe tests**: Use actual Stripe test keys and webhooks

## Stripe Integration
- **Products/Plans**: Managed in Stripe dashboard, synced via custom Artisan command
- **Webhooks**: Handle subscription events and plan changes
- **Frontend**: Stripe Elements for payment collection at `/subscription/checkout`
- **Trial logic**: Configurable per plan with automatic trial expiration handling

## Development Notes
- **Concurrent services**: Backend `composer dev` runs server, queue, and asset compilation
- **Hot reloading**: Both frontend (Next.js) and backend (Vite) support live updates
- **API structure**: Most endpoints require authentication; admin routes have additional middleware
- **Environment**: Use `.env` files for both frontend and backend configuration