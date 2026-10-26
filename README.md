# Automation Testing Practice Lab

A responsive, browser-only training application for learning UI automation with Selenium WebDriver, Playwright, Cypress, and other browser tools. It uses HTML5, CSS, JavaScript, Bootstrap 5, and local mock data. No backend, build step, login service, or runtime package installation is required.

## Run locally

1. Open this folder in VS Code.
2. Start the page with the Live Server extension by right-clicking `index.html` and selecting **Open with Live Server**.
3. Alternatively, run a local static server from this directory:

   ```powershell
   py -m http.server 8000
   ```

   Open `http://localhost:8000` in a browser. Python is only needed for this optional server command.

The stylesheet and Bootstrap bundle use CDN URLs. The app has no server-side data dependency; use an internet connection for those CDN assets. The page can also be opened directly as a local HTML file, though a local server is recommended for consistent browser context and frame behavior.

## Files

- `index.html` contains the application shell, module navigation, and practice markup.
- `styles.css` contains responsive layout and application styling.
- `app.js` implements local interactions and deterministic mock behavior.

## Modules

1. **Text & semantics**: Heading scale, inline formatting, lists, landmarks, and details/summary.
2. **Forms & inputs**: Native input types, validation, accessible errors, states, and registration success.
3. **Buttons & links**: Counters, state changes, reveal/hide, asynchronous mock action, dialogs, and downloads.
4. **Tables**: Employee dataset, search, sorting, pagination, addition, deletion, and semantic table structure.
5. **Selection controls**: Radio buttons, checkboxes, multi-select, disabled options, and dependent country/region selects.
6. **Locator playground**: IDs, names, roles, labels, test attributes, repeated targets, and an isolated duplicate-ID negative example.
7. **Dialogs & messages**: Native alert/confirm/prompt, delayed alert, native modal dialog, dismissible alert, and toast.
8. **Frames & windows**: Same-origin `srcdoc` iframe, new-tab examples, and window information.
9. **Mouse & keyboard**: Hover, double-click, custom context menu, drag/drop, keyboard events, and resizable panel.
10. **Async & waits**: Fixed-delay show/remove operations, progress, spinner, and mock request.
11. **Visibility & states**: Visible, hidden, disabled, read-only, opacity, off-screen, and replaced DOM node examples.
12. **HTML5 elements**: Progress, meter, details, contenteditable, template cloning, canvas, and SVG.
13. **File handling**: Single/multiple file selection, type filters, size checks, simulated upload, and TXT/CSV downloads.
14. **Search & filtering**: Local search, category filters, sorting, datalist suggestions, and empty results.
15. **Session scenarios**: Mock login and sessionStorage state. Demo credentials: `student` / `practice123`.
16. **Shadow DOM**: `practice-counter` custom element with an open shadow root.
17. **Accessibility**: Labels, described-by help, live region, focus styles, and a labeled negative example.
18. **Advanced scenarios**: Length boundaries, whitespace, Unicode, truncated text, and node replacement.

Use the sidebar search or the `/` keyboard shortcut to find modules. The reset control in the top bar reloads the app and clears mock session state; module-level reset buttons restore their module's initial state without leaving it.

## Locator practice

Prefer semantic and user-facing locators for the regular examples: role and accessible name, associated label, visible text, and stable `data-testid`/`data-test` values. Stable IDs and names are also provided for foundational exercises. The duplicate ID example is intentionally invalid and isolated; avoid using that pattern in application code.

## Suggested exercises

### Selenium WebDriver

- Submit the registration form empty, then with invalid email/password, then with valid values. Assert field-level errors and the live success message.
- Search the team table for a person, sort by role, add a row, and remove it using its row-specific accessible button name.
- Switch into the practice iframe, fill its input, click its button, and assert the frame status text.
- Handle the native confirm and prompt dialogs and verify the page status after accepting or dismissing them.
- Log in with the mock credentials, verify the protected area, then log out and confirm the session state is cleared.

### Playwright

- Use `getByRole` and `getByLabel` for the registration flow; assert the `role=status` result after submission.
- Use `getByTestId('locator-primary')` and compare it with an ID or name locator.
- Wait for the delayed element with a state assertion instead of a fixed sleep; verify the progress element reaches 100.
- Use `frameLocator('#practiceFrame')` to interact with the iframe. Use a popup event when testing the new-tab button.
- Access the open shadow root through the `practice-counter` host and assert the counter after clicking its internal button.

## Notes and troubleshooting

- Native JavaScript dialogs pause the page until dismissed; automation scripts need a dialog handler.
- Browser popup protection can block new tabs. Trigger the tab action from a direct user interaction and allow popups for the local origin if needed.
- Files are never transmitted. The 2 MB size check is a local demonstration only.
- Mock authentication is not secure authentication. The password is a fixed training example and is not stored in sessionStorage.
- If CDN assets are unavailable, the core HTML and interactions still work, but Bootstrap presentation may be reduced.
- Use a local server if a browser restricts behavior when opening the file directly.