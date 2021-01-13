import React, { useState, useEffect, useRef } from "react"

export default ({
  activeOption,
  filteredOptions,
  showOptions,
  userInput,
  renderOptions,
  setConfigData,
  storesData,
  configData,
}) => {
  const [clickedOutside, setClickedOutside] = useState(false)
  const [dropDownStatus, setDropDownStatus] = useState(false)
  const searchRef = useRef(null)
  const itemsRef = useRef([])

  const cleanTextInput = () => {
    setConfigData({
      ...configData,
      showOptions: true,
      userInput: "",
      renderOptions: storesData,
    })
  }

  const handleClick = (id) => {
    if (itemsRef) {
      itemsRef.current[id].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }

  const handleFilter = (e) => {
    const userInput = e.currentTarget.value
    const filteredOptions = storesData.filter((optionName) => {
      return (
        optionName.item.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
      )
    })
    setConfigData({
      activeOption: 0,
      filteredOptions,
      showOptions: true,
      userInput: e.currentTarget.value,
      renderOptions: filteredOptions,
    })
  }

  const onClickSelect = (e, item) => {
    setConfigData({
      activeOption: 0,
      filteredOptions: storesData.filter((optionName) => {
        return optionName.item.name == item.item.name
      }),
      showOptions: true,
      userInput: e.currentTarget.innerText,
      renderOptions: storesData.filter((optionName) => {
        return optionName.item.name == item.item.name
      }),
    })
    setDropDownStatus(false)
  }

  const handleKeySelect = (e) => {
    if (e.keyCode === 13 && userInput) {
      setConfigData({
        activeOption: 0,
        filteredOptions: storesData.filter((optionName) => {
          return optionName.item.name == filteredOptions[activeOption].item.name
        }),
        showOptions: true,
        userInput: filteredOptions[activeOption].item.name,
        renderOptions: storesData.filter((optionName) => {
          return optionName.item.name == filteredOptions[activeOption].item.name
        }),
      })
    } else if (e.keyCode === 38 && userInput) {
      if (activeOption === 0) {
        return
      }

      itemsRef.current[activeOption].scrollIntoView({
        behavior: "auto",
        block: "nearest",
      })
      setConfigData({
        activeOption: activeOption - 1,
        showOptions: false,
        filteredOptions: filteredOptions,
        userInput: filteredOptions[activeOption].item.name,
        renderOptions: storesData.filter((optionName) => {
          return optionName.item.name == filteredOptions[activeOption].item.name
        }),
      })
    } else if (e.keyCode === 40 && userInput) {
      if (activeOption === filteredOptions.length - 1) {
        return
      }
      setConfigData({
        activeOption: activeOption + 1,
        showOptions: false,
        filteredOptions: filteredOptions,
        userInput: filteredOptions[activeOption].item.name,
        renderOptions: storesData.filter((optionName) => {
          return optionName.item.name == filteredOptions[activeOption].item.name
        }),
      })
      handleClick(activeOption)
    }
  }

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setClickedOutside(true)
    }
  }
  const handleClickInside = () => setClickedOutside(false)

  useEffect(() => {
    if (searchRef) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [searchRef])

  useEffect(() => {
    if (clickedOutside) {
      setDropDownStatus(false)
      return
    }
  }, [clickedOutside])

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, filteredOptions.length)
  }, [filteredOptions])

  return (
    <div ref={searchRef}>
      <div class="search-wrapper">
        <div class="search-bar">
          <input
            type="text"
            placeholder="Search"
            class="search-box"
            autoFocus
            onChange={handleFilter}
            onKeyDown={handleKeySelect}
            value={userInput}
            onClick={() => {
              setDropDownStatus(true)
              handleClickInside()
            }}
          />
        </div>
        {userInput && (
          <button class="delete-button" onClick={cleanTextInput}>
            Clear
          </button>
        )}
      </div>

      {dropDownStatus && userInput && (
        <div class="search-dropdown">
          <ul id="style-1">
            {filteredOptions.map((item, index) => {
              let className
              if (index === activeOption) {
                className = "option-active"
              }
              return (
                <li
                  ref={(el) => (itemsRef.current[index] = el)}
                  className={className}
                  onClick={(e) => {
                    onClickSelect(e, item)
                  }}
                >
                  <img loading="lazy" src={item.detail.image} alt="" />
                  <span> {item.item.name}</span>
                </li>
              )
            })}
            {filteredOptions.length >= 2 ? (
              <li
                onClick={() => {
                  handleClick(1)
                }}
              >
                <button class="bottom-button">Back To Top</button>
              </li>
            ) : null}
          </ul>
        </div>
      )}
    </div>
  )
}
