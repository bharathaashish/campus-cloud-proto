# TODO: Allow Users to Delete Their Own Posts

## Backend Changes
- [x] Modify delete route in `backend/routes/posts.js` to allow post authors to delete their posts (in addition to admins)

## Frontend Changes
- [x] Add delete button in `src/components/Home.jsx` for each post, visible only to the author
- [x] Add delete button in `src/components/PostModal.jsx`, visible only to the author

## Testing
- [x] Test deletion functionality for authors
- [x] Verify restrictions for non-authors/admins
- [x] Ensure no other functionality is disturbed
