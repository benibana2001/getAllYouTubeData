import * as React from "react"
import { InputType, isInputType } from "../store"

export default function FormArea({ requestYouTube }) {
  const [inputValue, setInputValue] = React.useState<string>("")

  const [inputMethod, setInputMehod] = React.useState<InputType>('handleName')

  const handleChangeTextArea = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setInputValue(event.target.value)
  }

  const handleClickInputMethod = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.value)
    if (isInputType(e.currentTarget.value)) {
      setInputMehod(e.currentTarget.value)
    } else {
      console.log('inputMethodには"channelID"か"handleName"を設定する必要がある')
    }
  }

  const handleSubmit = () => {
    requestYouTube(inputValue, { inputType: inputMethod })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <>
      <form>
        <div className="input-area">
          {/* チャンネル指定方法を選択ボタン */}
          <div className="button-input-methods">
            <label>
              <span className="field-label">検索方法を選択</span>
              <span className="field-hint">チャンネルの検索指定条件を以下のいずれかから選択する</span>
            </label>

            <div className="inner">
              <button
                className={inputMethod === 'handleName' ? "input-method-selected" : ''}
                onClick={handleClickInputMethod}
                value={'handleName'}
              >
                ハンドルネーム
              </button>
              <button
                className={inputMethod === 'channelID' ? "input-method-selected" : ''}
                onClick={handleClickInputMethod}
                value={'channelID'}
              >
                チャンネルID
              </button>
            </div>
          </div>

          {/* 文字列入力*/}
          <div className="text-input">
            {inputMethod === 'channelID' &&
              <div>
                <label htmlFor="inputValueChannelID">チャンネルID</label>
                <div className="inner">
                  <input
                    id="inputValueChannelID"
                    name="inputValue"
                    type="text"
                    value={inputValue}
                    onChange={handleChangeTextArea}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            }
            {inputMethod === 'handleName' &&
              <div>
                <label htmlFor="inputValueHandleName">ハンドルネーム</label>
                <div className="inner">
                  <input
                    id="inputValueHandleName"
                    name="inputValue"
                    type="text"
                    value={inputValue}
                    onChange={handleChangeTextArea}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            }
          </div>
        </div>

        <input
          className="button-search"
          type="button"
          data-func="search"
          value="検索"
          onClick={handleSubmit}
        />
      </form>
    </>
  )
}
