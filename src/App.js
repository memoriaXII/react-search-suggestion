import React, { useState, useEffect, lazy, useRef, Suspense } from "react"
import "./App.scss"
import data from "./storesData.json"

const CardsList = lazy(() => import("./components/Cards"))
const Header = lazy(() => import("./components/Header"))
const SearchBar = lazy(() => import("./components/SearchBar"))
const SearchKeyword = lazy(() => import("./components/SearchKeyword"))

const App = () => {
  const storesData = Object.values(data)
  const [configData, setConfigData] = useState({
    activeOption: 0,
    filteredOptions: [],
    showOptions: false,
    userInput: "",
    renderOptions: storesData,
  })

  const {
    activeOption,
    filteredOptions,
    showOptions,
    userInput,
    renderOptions,
  } = configData

  return (
    <div>
      <Suspense fallback={null}>
        <Header />
        <div class="wrapper">
          <div class="main-container">
            <SearchBar
              userInput={userInput}
              showOptions={showOptions}
              activeOption={activeOption}
              filteredOptions={filteredOptions}
              setConfigData={setConfigData}
              renderOptions={renderOptions}
              storesData={storesData}
              configData={configData}
            />
            <SearchKeyword
              userInput={userInput}
              filteredOptions={filteredOptions}
            />
            <div style={{ marginTop: `${10}px`, height: `${80}vh` }}>
              <CardsList renderOptions={renderOptions} userInput={userInput} />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  )
}

export default App
