Here's a basic `README.md` file for your **Shadowcast Viewer** app. This covers the key aspects of your app, including setup instructions, how to build, and how to publish a release.

### `README.md`

```markdown
# Shadowcast Viewer

**Shadowcast Viewer** is an Electron-based desktop application that provides a full-screen view of camera sources. It allows users to select available webcams and view them in full-screen mode with the ability to hide the cursor and re-enter full-screen mode by clicking on the video.

## Features

- **Webcam Selection**: Select from available camera sources via a grid.
- **Full-Screen Mode**: Automatically goes full-screen when a camera is selected.
- **Aspect Ratio Preservation**: Ensures that the entire camera view is shown without cropping, preserving the aspect ratio, and adding black bars if needed.
- **Mouse Cursor Hiding**: The mouse cursor is hidden when in full-screen mode and reappears on exit.
- **Re-Enter Full-Screen**: Click on the video to re-enter full-screen mode if it has been exited.
- **GitHub Release Automation**: Automatically tags a version and creates a GitHub release with the built binary.

---

## Prerequisites

- **Node.js** (v14 or later)
- **npm**
- **GitHub CLI (`gh`)**
- **Git** (for version control and tagging)

---

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/shadowcast-viewer.git
   cd shadowcast-viewer
   ```

2. **Install dependencies**:

   Install the required Node.js dependencies:

   ```bash
   npm install
   ```

3. **GitHub CLI Setup**:

   Ensure that you have the **GitHub CLI** installed and authenticated:

   ```bash
   gh auth login
   ```

---

## Running the Application

### Development Mode

To run the application in development mode:

```bash
npm run dev
```

This will start the Vite development server and launch the Electron app. You can view the app at `http://localhost:5173`.

---

## Building the Application

To create a production build of the app, use the provided `build.sh` script:

1. **Run the build script**:

   ```bash
   ./build.sh
   ```

   This will:
   - Increment the patch version in `package.json`.
   - Build the app using `electron-builder`.
   - Copy the built executable to the destination specified in `.dest-path`.

2. **Binary Location**:
   The resulting binary will be stored in the `dist/` directory and copied to the path specified in `.dest-path`.

---

## Publishing a Release

To create a GitHub release and upload the built binary, use the `publish.sh` script:

1. **Ensure the build is complete**:

   Make sure the build has been run and the executable exists in the `dist/` folder.

2. **Run the publish script**:

   ```bash
   ./publish.sh
   ```

   This will:
   - Tag the current version in Git.
   - Push the tag to the GitHub repository.
   - Create a GitHub release with the tagged version.
   - Upload the built executable to the release.

---

## Versioning

The app uses semantic versioning with the following format:

```
<major>.<minor>.<patch>
```

Each time the `build.sh` script is run, the patch version is automatically incremented in `package.json`.

---

## Configuration

- **.dest-path**: This file should contain the absolute path where the built binary will be copied after the build is complete.

   Example `.dest-path` content:

   ```
   /d/Dropbox/Apps/ShadowcastViewer
   ```

- **package.json**: The version field is automatically incremented during the build process.

---

## License

[MIT](LICENSE)

```

### Summary of the Sections:

- **Features**: Overview of key features in the app.
- **Prerequisites**: What tools and dependencies are required for the project.
- **Setup Instructions**: Steps to clone the repo and install dependencies.
- **Running the Application**: How to run the app in development mode.
- **Building the Application**: Instructions for using the `build.sh` script to build the app.
- **Publishing a Release**: Instructions for using the `publish.sh` script to create a GitHub release.
- **Versioning**: Explanation of how the versioning works with the automated version increment.
- **Configuration**: Explanation of `.dest-path` and versioning behavior in `package.json`.

### Additional Notes:

- Be sure to update the GitHub repo URL in the setup section if necessary.
- You can extend the documentation as needed, especially if you add new features or steps.

Let me know if you need any more changes or additions!
