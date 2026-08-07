
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { fetchModels, describeImage } from './lmStudioClient';
import './i18n';

const processImage = (file: File, maxSize: number = 1024, quality: number = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context not available'));
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

interface FormInputs {
  images: FileList;
}

interface ImageResult {
  image: string;
  filename: string;
  json: unknown;
}

function MainApp() {
  const { t, i18n } = useTranslation();
  const [isShortMode, setIsShortMode] = useState(true);
  const [results, setResults] = useState<ImageResult[]>([]);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);

  const { data: modelsData, error: modelsError } = useSWR('lmstudio-status', fetchModels, { 
    refreshInterval: 3000,
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });
  const isConnected = !!modelsData && !modelsError;

  const { register, handleSubmit, reset } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    if (!data.images || data.images.length === 0) return;
    
    for (const file of Array.from(data.images)) {
      try {
        setProcessingStatus(t('compressing', { filename: file.name }));
        const base64data = await processImage(file, 1024, 0.85);
        const previewUrl = `data:image/jpeg;base64,${base64data}`;
        
        setProcessingStatus(t('analyzing', { filename: file.name }));
        
        const result = await describeImage(base64data, isShortMode, i18n.language);
        
        // --- ÄNDERUNG HIER: Das neue Ergebnis wird vorne an das Array ('prev') angehängt ---
        setResults(prev => [{ image: previewUrl, json: result, filename: file.name }, ...prev]);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
    setProcessingStatus(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-base-100 p-6 md:p-8 rounded-2xl shadow-xl">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-base-300 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <span className="icon-[mdi--robot-outline] text-primary text-4xl"></span> 
              {t('title')}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className={`badge ${isConnected ? 'badge-success' : 'badge-error'} gap-1`}>
                <span className={isConnected ? "icon-[mdi--check-circle]" : "icon-[mdi--alert-circle]"}></span>
                {isConnected ? t('connected') : t('disconnected')}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 bg-base-200 p-3 rounded-lg">
            <select 
              className="select select-sm select-bordered" 
              onChange={(e) => i18n.changeLanguage(e.target.value)} 
              defaultValue={i18n.language}
            >
              <option value="de">🇩🇪 DE</option>
              <option value="en">🇬🇧 EN</option>
              <option value="hu">🇭🇺 HU</option>
            </select>
            
            <label className="label cursor-pointer gap-3">
              <span className={`text-sm font-semibold ${!isShortMode ? 'text-primary' : 'text-base-content/50'}`}>
                {t('longMode')}
              </span> 
              <input 
                type="checkbox" 
                className="toggle toggle-primary toggle-lg" 
                checked={isShortMode} 
                onChange={() => setIsShortMode(!isShortMode)} 
              />
              <span className={`text-sm font-semibold ${isShortMode ? 'text-primary' : 'text-base-content/50'}`}>
                {t('shortMode')}
              </span>
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mb-10">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-bold text-lg">{t('upload')}</span>
            </label>
            <div className="flex gap-4 items-center">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="file-input file-input-bordered file-input-primary w-full max-w-md" 
                {...register("images", { required: true })}
                disabled={!!processingStatus || !isConnected} 
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!!processingStatus || !isConnected}
              >
                <span className="icon-[mdi--upload] text-xl"></span> {t('describe')}
              </button>
            </div>
            {processingStatus && (
              <p className="mt-4 text-primary font-semibold flex items-center gap-2">
                <span className="loading loading-spinner loading-md"></span> 
                {processingStatus}
              </p>
            )}
            {!isConnected && (
              <p className="mt-2 text-sm text-error opacity-80">
                Hint: Ensure LM Studio Server is running and <strong>CORS is enabled</strong> in the settings.
              </p>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {results.map((res, idx) => (
            <div key={idx} className="card bg-base-200 shadow-xl overflow-hidden border border-base-300">
              <figure className="relative bg-black">
                <img src={res.image} alt={t('previewAlt')} className="h-64 w-full object-contain opacity-90" />
                <div className="absolute top-2 left-2 badge badge-neutral opacity-80">{res.filename}</div>
              </figure>
              <div className="card-body p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="icon-[mdi--code-json] text-2xl text-secondary"></span>
                  <h2 className="card-title text-lg m-0">{t('jsonOutput')}</h2>
                </div>
                <div className="mockup-code bg-neutral text-neutral-content w-full">
                  <pre className="px-4 py-2 text-xs overflow-auto max-h-64 whitespace-pre-wrap">
                    <code>{JSON.stringify(res.json, null, 2)}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
