import { useState, useEffect } from "react"

function App() {
  const [sourceLang, setSourceLang] = useState('pt')
  const [targetLang, setTargetLang] = useState('en')
  const [sourceText, setSourceText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [translatedText, setTranslatedText] = useState('')
  const [error, setError] = useState('')

  const language = [
    { code: 'en', name: 'Inglês' },
    { code: 'es', name: 'Espanhol' },
    { code: 'fr', name: 'Francês' },
    { code: 'de', name: 'Alemão' },
    { code: 'pt', name: 'Portguês' },
  ]

  useEffect(() => {

    if (sourceText) {
      const delay = setTimeout(() => {
        handleTranslate()
      }, 500);
      return () => clearTimeout(delay)
    }

  }, [sourceText, sourceLang, targetLang])


  const handleTranslate = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${sourceText}&langpair=${sourceLang}|${targetLang}`)
      if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`)
      }
      const data = await response.json()
      setTranslatedText(data.responseData.translatedText)
    } catch (err) {
      console.log(err)
      setError(`Erro ao tentar traduzir: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const swapTranslate = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
          <h1 className="text-headerColor text-2xl font-normal">Projeto Tradução com React</h1>
        </div>
      </header>

      <main className="flex-grow flex items-start justify-center px-44 py-8">
        <div className="w-full max-h-5xl bg-white rounded-r-lg shadow-sm overflow-hidden ">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <select value={sourceLang} onChange={event => setSourceLang(event.target.value)} className="text-sm text-textColor bg-transparent border-none focus:outline-none cursor-pointer">
              {language.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>

            <button className="p-4 rounded-full hover:bg-gray-200 outline-none" onClick={swapTranslate}>
              <svg

                className="w-5 h-5 text-headerColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>

            <select value={targetLang} onChange={event => setTargetLang(event.target.value)} className="text-sm text-textColor bg-transparent border-none focus:outline-none cursor-pointer">
              {language.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4">
              <textarea value={sourceText} onChange={event => setSourceText(event.target.value)} placeholder="Digite um texto para ser traduzido" className="w-full h-40 text-lg text-textColor bg-transparent resize-none border-none outline-none"></textarea>
            </div>
            <div className="p-4 relative bg-secondaryBackground border-l border-gray-200">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                </div>
              ) :
                <p className="text-lg text-textColor">{translatedText}</p>
              }
            </div>
          </div>
          {error && (
            <div className="p-4 bg-red-100 border-t border-red-400 text-red-700">
              {error}
            </div>
          )}
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto flex justify-center">
        <div className="px-4 py-3 text-sm text-headerColor flex items-center">
          &copy; {new Date().getFullYear()} Tradutor Guilherme Rippel
        </div>
      </footer>
    </div>
  )
}

export default App