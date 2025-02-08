/****************************************************
 * 通信処理の際に表示するローダー
 ***************************************************/
const loader = function () {
  /**
   * @type {HTMLElement}
   */
  const elemBlocker = document.querySelector(".blocker");
  document.addEventListener(
    "busy",
    /**
     * @param {CustomEvent} event
     */
    (event) => {
      if (event.detail) {
        elemBlocker.dataset.busy = "true";
      } else {
        elemBlocker.dataset.busy = "false";
      }
    },
  );
};

export { loader };
