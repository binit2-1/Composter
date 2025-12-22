# Using Issue & Pull Request Templates

This project includes a set of issue and pull request templates to help contributors open well-formed issues and PRs.

## Where the templates live
- Issue templates: `.github/ISSUE_TEMPLATE/`
- PR templates: `.github/PULL_REQUEST_TEMPLATE/`

## Creating an issue with a specific template
When you click **New issue** in GitHub you'll be shown the available issue templates. You can also open a template directly using the `template` query parameter. Example:

```
https://github.com/binit2-1/Composter/issues/new?template=bug_report.md
```

## Creating a PR with a specific template
When opening a pull request in the browser you can choose a template from the dropdown. You can also pre-select a template by adding `?template=NAME` to the compare URL. Example:

```
https://github.com/binit2-1/Composter/compare/main...branch-name?template=bug_fix.md
```

## Auto-closing issues from PRs
To automatically close an issue when your PR is merged, include one of these keywords followed by the issue number in your PR description (anywhere in the body):

- `Closes #123`
- `Fixes #123`
- `Resolves #123`

Replace `123` with the issue number. This will cause GitHub to automatically close the referenced issue when the PR is merged into the default branch.

## Best practices
- Always reference the issue you are solving in the PR description using `Closes #<issue>`.
- Pick the most appropriate issue template when opening issues (bug, feature, docs, etc.).
- Use the `Good First Issue` template for beginner-friendly tasks.
- For PRs that change UI, include before/after screenshots in the PR template.

## Troubleshooting
- If a template doesn't appear in the dropdown, ensure the filename ends with `.md` and lives in the correct directory: `.github/PULL_REQUEST_TEMPLATE/` or `.github/ISSUE_TEMPLATE/`.
- Use the `?template=` URL parameter to force selection of a specific template.

## Links
- `.github/ISSUE_TEMPLATE/`
- `.github/PULL_REQUEST_TEMPLATE/`

---

If you'd like, we can extend this page with examples for common PRs or a short checklist for maintainers.