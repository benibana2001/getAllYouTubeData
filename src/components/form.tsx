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
      <div>
        <h2>検索フォーム</h2>
        <p>任意のYouTubeアカウントハンドルネーム（もしくはチャンネルID）を使用して、そのアカウントの詳細情報を取得・表示します。情報の取得には<a target="_blank" href="https://developers.google.com/youtube/v3/getting-started?hl=ja">YoutubeDataAPI</a>を使用しています。</p>
      </div>
      <form>
        <div className="input-area">
          {/* チャンネル指定方法を選択ボタン */}
          <div className="button-input-methods">
            <label>
              <span className="field-label">検索方法の選択</span>
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
                <label>
                  <label htmlFor="inputValueChannelID">
                    <span className="field-label">チャンネルID</span>
                    <span className="field-hint">
                      一般的にUCの２文字から始まるチャンネル固有の文字列です<br />（例：UCAuUUnT6oDeKwE6v1NGQxug）
                    </span>
                  </label>
                </label>
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
                <label htmlFor="inputValueHandleName">
                  <span className="field-label">ハンドルネーム</span>
                  <span className="field-hint">
                    @から始まるアカウント固有の文字列です（例：@TED）
                  </span>
                </label>
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
