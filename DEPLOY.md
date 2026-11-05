# Publish with GitHub Pages

This is a static HTML/CSS/JavaScript site. The `media` folder is included in the repository, so visitors can play the videos without signing in.

## Publish

1. Create a **public** GitHub repository and push the contents of this folder to its `main` branch.
2. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
3. The workflow in `.github/workflows/pages.yml` will publish the site. The public URL appears in **Settings → Pages** after the workflow completes.

Keep the `media` folder and its filenames unchanged. GitHub Pages is a public website; files in the public repository can also be downloaded by anyone.
