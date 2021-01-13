import AutoSizer from "react-virtualized-auto-sizer"
import { FixedSizeList as List } from "react-window"
import memoize from "memoize-one"
import React, { useEffect, useRef, useState } from "react"

export default ({ renderOptions, userInput }) => {
  const ITEMS_COUNT = renderOptions.length
  const ITEM_SIZE = 350
  let collections = document.getElementsByClassName("test")
  const scrollRef = useRef(null)
  const [isScrollingStatus, setIsScrolling] = useState(false)

  useEffect(() => {
    const lazyImageFn = () => {
      var lazyloadImages
      if ("IntersectionObserver" in window) {
        lazyloadImages = document.querySelectorAll("img.lzy_img")
        const imageObserver = new IntersectionObserver(
          (entries, imgObserver) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const lazyImage = entry.target
                lazyImage.src = lazyImage.dataset.src
                lazyImage.classList.remove("lzy_img")
                imgObserver.unobserve(lazyImage)
              }
            })
          }
        )
      } else {
        var lazyloadThrottleTimeout
        lazyloadImages = document.querySelectorAll("img.lzy_img")
        const lazyload = () => {
          if (lazyloadThrottleTimeout) {
            clearTimeout(lazyloadThrottleTimeout)
          }
          lazyloadThrottleTimeout = setTimeout(function () {
            var scrollTop = window.pageYOffset
            lazyloadImages.forEach((img) => {
              if (img.offsetTop < window.innerHeight + scrollTop) {
                img.src = img.dataset.src
                img.removeAttribute("data-src")
              }
            })
            if (lazyloadImages.length == 0) {
              document.removeEventListener("scroll", lazyload)
              window.removeEventListener("resize", lazyload)
              window.removeEventListener("orientationChange", lazyload)
            }
          }, 20)
        }
        document.addEventListener("scroll", lazyload)
        window.addEventListener("resize", lazyload)
        window.addEventListener("orientationChange", lazyload)
      }
    }
    document.addEventListener("DOMContentLoaded", lazyImageFn)
    return () => document.removeEventListener("DOMContentLoaded", lazyImageFn)
  }, [])
  return (
    <>
      <AutoSizer>
        {({ height, width }) => {
          const itemsPerRow = Math.floor(width / ITEM_SIZE) || 1
          const rowCount = Math.ceil(ITEMS_COUNT / itemsPerRow)
          const Row = memoize(({ index, style, data, isScrolling }) => {
            const items = []
            const fromIndex = index * itemsPerRow
            const toIndex = Math.min(fromIndex + itemsPerRow, ITEMS_COUNT)

            for (let i = fromIndex; i < toIndex; i++) {
              items.push(
                <div className="info-card" style={{ marginTop: 20 }} key={i}>
                  <div class="info-card-header">
                    <img
                      loading="lazy"
                      id="some-id"
                      class="lzy_img"
                      data-scr={data[i].detail.image}
                      src={data[i].detail.image}
                      alt=""
                    />
                    <div class="dots"></div>
                  </div>
                  <div class="info-card-title">{data[i].item.name}</div>

                  <div class="info-card-buttons">
                    <button class="buttons card-buttons-msg">Check Info</button>
                  </div>
                </div>
              )
            }
            if (renderOptions.length) {
              return (
                <div className="cards-container" style={style}>
                  {items}
                </div>
              )
            }
            return (
              <div className="no-options">
                <em>No Option!</em>
              </div>
            )
          })

          return (
            <List
              useIsScrolling
              width={width}
              height={height}
              itemCount={rowCount}
              itemData={renderOptions}
              itemSize={340}
            >
              {Row}
            </List>
          )
        }}
      </AutoSizer>
    </>
  )
}
