export default ({ filteredOptions, userInput }) => {
  return (
    <div style={{ marginTop: 20 }}>
      {filteredOptions.length ? (
        <>
          Showing
          <span
            style={{
              fontWeight: "bold",
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            {filteredOptions.length}
          </span>
          results from keyword
          <span
            style={{
              fontWeight: "bold",
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            {userInput}
          </span>
        </>
      ) : null}
    </div>
  )
}
