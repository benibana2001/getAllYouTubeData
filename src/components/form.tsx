import * as React from "react"
import { InputType } from "../store"

export default function FormArea({ requestYouTube }) {
  const [inputValue, setInputValue] = React.useState<string>("")

  const [radioValue, setRadioValue] = React.useState<InputType>('handleName')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setInputValue(event.target.value)
  }

  const hadleChangeRadio = (e) => {
    console.log(e.target.value)
    setRadioValue(e.target.value)
  }

  const handleSubmit = () => {
    requestYouTube(inputValue, { inputType: radioValue })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
  }


  return (
    <form>
      <h1>GET ALL YOUTUBE VIDEOS FOR A SPECIFIC USER</h1>
      <div>
        <label htmlFor="radio_1">ハンドルネーム</label>
        <input
          id="radio_1"
          type="radio"
          value={'handleName'}
          name="group"
          onChange={hadleChangeRadio}
          defaultChecked={true}
        />
        <label htmlFor="radio_2">チャンネルID</label>
        <input
          id="radio_2"
          type="radio"
          value={'channelID'}
          name="group"
          onChange={hadleChangeRadio}
        />
      </div>

      <div>
        {radioValue === 'channelID' &&
          <input
            name="inputValue"
            type="text"
            value={inputValue}
            placeholder='チャンネルID'
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        }
        {radioValue === 'handleName' &&
          <input
            name="inputValue"
            type="text"
            value={inputValue}
            placeholder='ハンドルネーム'
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        }
        <input
          className="button-search"
          type="button"
          data-func="search"
          value="SEARCH"
          onClick={handleSubmit}
        />
      </div>
    </form>
  )
}
