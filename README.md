# **🤖 LM Studio Image Describer**

A modern, fast, localized React web application that uses local Vision Language Models (VLMs) running via **LM Studio** to automatically analyze images, generate captions, and extract structured metadata.

The application optimizes images client-side before sending them to your local server, processing them into structured, type-safe JSON objects matching custom schemas for titles, descriptions, keyword generation, and item tracking.

## **✨ Key Features**

* **Local Vision Processing:** Keep your data completely private. All image evaluations happen entirely on your machine via LM Studio.
* **Dual Analysis Modes:**
   * **Short Mode:** Generates clean, concise titles and a set of search-friendly keywords.
   * **Long Mode:** Delivers a deep-dive analysis including a robust description, an asset breakdown list, and expanded keyword tags.
* **Structured JSON Output:** Utilizes strict JSON schema execution formats enforced through LM Studio endpoints to guarantee parseable object results.
* **Smart Multi-Language Support:** Fully translated interface and dynamic LLM instruction injection for **English**, **German (Deutsch)**, and **Hungarian (Magyar)**.
* **Client-Side Image Optimization:** Automatically downscales and compresses heavy images to a maximum of 1024px before transmission to ensure speedy inference and low memory footprints.
* **Batch Image Processing:** Queue up multiple files at once. The application handles them iteratively and displays results dynamically, placing newer entries right at the top.
* **Real-time Connection Polling:** Uses SWR to check the live heartbeat status of your local LM Studio instance every 3 seconds.

## **🛑 Prerequisites**

To run this app successfully, you must have an active instance of **LM Studio** with a multimodal/vision-capable model loaded.

1. **Download LM Studio:** Ensure you have the platform installed.
2. **Load a Vision Model:** Download and load a vision-capable LLM (e.g., Llama-3.2-Vision, Moondream2, or Llava).
3. **Start the Local Server:** Navigate to the Local Server tab (the double-arrow icon) and turn on the server (defaulting to http://localhost:1234).
4. **⚠️ Enable CORS (Crucial):** Go into your LM Studio server settings and ensure that **Cross-Origin Resource Sharing (CORS)** is explicitly **enabled**. If disabled, the web application will be blocked from sending payload commands.

## **🚀 Getting Started**

### **1\. Clone & Install Dependencies**

Navigate to the directory and install the required node modules using your preferred package manager:

npm install  
\# or  
yarn install  
\# or  
pnpm install

### **2\. Run the Development Server**

Fire up Vite's lightning-fast development engine:

npm run dev

Open your browser to the local port displayed in your terminal console (typically http://localhost:5173).

### **3\. Build for Production**

To bundle a production-ready compilation inside the /dist directory:

npm run build

## **🛠️ Built-With Tech Stack**

This project architecture builds upon a performance-first setup using modern utility tools:

* **Core Engine:** [React 19](https://react.dev/) \+ [TypeScript](https://www.typescriptlang.org/) \+ [Vite 8](https://vite.dev/)
* **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/) (using the unified @import "tailwindcss" engine) along with [DaisyUI v5](https://daisyui.com/) for elegant layout presets.
* **State & Fetching:** [SWR](https://swr.vercel.app/) for automatic API connection tracking loops.
* **Form Management:** [React Hook Form](https://react-hook-form.com/) for lightweight image file uploads.
* **Internationalization:** [i18next](https://www.i18next.com/) \+ react-i18next for seamless language hot-swapping.
* **Icons:** [@iconify/tailwind4](https://iconify.design/) providing zero-overhead web components (like icon-\[mdi--robot-outline\]).

## **📂 Configuration Breakdown**

* **API Targeting (src/lmStudioClient.ts):** Requests direct data transfers to http://localhost:1234/v1/chat/completions. It utilizes the model fallback alias "local-model" which maps cleanly to whichever active version is currently loaded in your LM Studio UI.
* **Bundler Contexts (repomix.config.json):** Set up with packaging ignore configurations to keep AI repository sweeps focused cleanly on source-code parameters.