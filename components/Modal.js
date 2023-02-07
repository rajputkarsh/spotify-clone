import React from 'react'

export default function Modal({ setShowModal, title, children }) {
  return (
    <>
      <div
        className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none"
      >
        <div className="relative my-6 mx-auto w-auto max-w-3xl">
          <div style={{background: '#111111'}} className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
              <h6 className="text-2xl font-semibold text-white">{title}</h6>
              <button
                className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="block h-6 w-6 bg-transparent text-2xl text-white outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative flex-auto p-6">{children}</div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  )
}
