# QA Checklist - Aura Square Profile System

## Authentication & Authorization

- [ ] User can sign up with email/password
- [ ] User can log in with email/password
- [ ] Google OAuth login works (if configured)
- [ ] Apple Sign In shows fallback message if not configured
- [ ] User session persists across page refreshes
- [ ] User can log out successfully
- [ ] Protected routes redirect to login if not authenticated
- [ ] Admin routes are only accessible to admin users
- [ ] Dealer routes show dealer-specific features

## Profile Page

- [ ] Profile page loads for authenticated users
- [ ] Profile page redirects to login for unauthenticated users
- [ ] Overview tab shows correct stats (listings, favorites, messages, views, leads)
- [ ] My Listings tab displays all user's listings
- [ ] Listings can be filtered by status (all, draft, published, removed)
- [ ] User can publish/unpublish listings
- [ ] User can edit listings (navigates to edit page)
- [ ] User can delete listings with confirmation
- [ ] Favorites tab shows saved properties
- [ ] User can remove favorites
- [ ] Messages tab displays inquiries
- [ ] Messages can be marked as read
- [ ] Account Settings allows updating name, email, phone
- [ ] Avatar upload works
- [ ] Profile changes save successfully

## Dealer Features

- [ ] Dealer tab appears for users with dealer role
- [ ] Dealer can submit verification documents
- [ ] Verification status shows correctly (pending/approved)
- [ ] Dealer analytics display (listings, views, leads)
- [ ] Company information displays correctly

## Admin Panel

- [ ] Admin panel only accessible to admin users
- [ ] Admin can view all users
- [ ] Admin can change user roles (buyer/dealer/admin)
- [ ] Admin can view all listings
- [ ] Admin can delete any listing
- [ ] Admin can view pending dealer verifications
- [ ] Admin can approve dealer verifications
- [ ] Search functionality works in admin panel

## Listings Management

- [ ] User can create new listing via Post Property page
- [ ] Listing creation requires authentication
- [ ] Multiple photos can be uploaded
- [ ] Photos can be reordered
- [ ] Photos can be deleted
- [ ] Listing status can be changed (draft/published/removed)
- [ ] Only owner or admin can edit/delete listings
- [ ] Listing views increment correctly
- [ ] Listing leads increment when message sent

## Messages & Inquiries

- [ ] Users can send messages about listings
- [ ] Messages appear in listing owner's inbox
- [ ] Messages show as unread until opened
- [ ] Message sender information displays correctly
- [ ] Anonymous users can send messages (if allowed)

## Favorites

- [ ] Users can favorite listings
- [ ] Favorites appear in profile
- [ ] Users can remove favorites
- [ ] Favorite count updates correctly

## Header & Navigation

- [ ] Header alignment is correct (logo left, nav center, actions right)
- [ ] Sign Up button always visible on desktop
- [ ] Mobile menu works correctly
- [ ] User dropdown shows profile link
- [ ] Admin dropdown shows admin panel link
- [ ] Header sticky behavior works on scroll
- [ ] Z-index conflicts resolved (no overlapping)

## Responsive Design

- [ ] All pages work on 1440px width
- [ ] All pages work on 1280px width
- [ ] All pages work on 1024px width
- [ ] All pages work on 768px width
- [ ] All pages work on 414px width
- [ ] All pages work on 390px width
- [ ] All pages work on 360px width
- [ ] Cards display correctly on all screen sizes
- [ ] Buttons are properly sized on mobile (44px+ height)
- [ ] Forms are usable on mobile

## Data Persistence

- [ ] User data persists after page refresh
- [ ] Listings persist after page refresh
- [ ] Favorites persist after page refresh
- [ ] Messages persist after page refresh
- [ ] Profile changes persist

## Error Handling

- [ ] Error messages display for failed API calls
- [ ] Loading states show during async operations
- [ ] Empty states display when no data
- [ ] Validation errors show for invalid inputs

## Performance

- [ ] Pages load quickly
- [ ] Images lazy load
- [ ] No console errors
- [ ] No memory leaks

## Accessibility

- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] ARIA labels present
- [ ] Screen reader friendly
- [ ] Color contrast meets WCAG standards

