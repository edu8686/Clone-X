export default function RightSection() {
  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-3 border border-gray-200 rounded-2xl w-[380px] h-[180] mt-4 pl-4 pr-4 pt-3 pb-3 ">
          <h2 className="text-[20px] font-bold ">Suscríbete a Premium</h2>
          <p className="text-[15px] ">
            Suscríbete para desbloquear nuevas funciones y, si eres elegible,
            recibir un pago de cuota de ingresos.
          </p>
          <button
            className="w-[120px] px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-full text-sm font-semibold bg-blue-400 text-white dark:text-white hover:bg-blue-500 dark:hover:bg-gray-800 transition-colors mb-2"
            onClick={() => {
              alert("Decoration section");
            }}
          >
            Suscribirse
          </button>
        </div>
        <div className="flex flex-col gap-3 border border-gray-200 rounded-2xl w-[380px] h-[180] mt-4 pl-4 pr-4 pt-3 pb-3 ">
          <div>
            <h2 className="text-[20px] font-bold ">En directo en X</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 50 50"
                className="mt-0"
              >
                <path d="M 0 15 L 0 34 L 4 34 L 4 25 C 4 24.5 4.398438 24 5 24 L 8 24 C 8.5 24 9 24.398438 9 25 L 9 34 L 13 34 L 13 24 C 13 21.800781 11.199219 20 9 20 L 4 20 L 4 15 Z M 30 15 L 30 34 L 34 34 L 34 15 Z M 15 20 L 15 30 C 15 32.199219 16.800781 34 19 34 L 24 34 C 26.199219 34 27.992188 32.199219 28.09375 30 L 28.09375 20 L 24.09375 20 L 24.09375 28.90625 C 24.09375 29.507813 23.601563 30 23 30 L 20.09375 30 C 19.492188 30 19 29.507813 19 28.90625 L 19 20 Z M 36 20 L 36 30 C 36 32.199219 37.800781 34 40 34 L 45 34 C 47.199219 34 49 32.199219 49 30 L 49 20 L 45 20 L 45 29 C 45 29.5 44.601563 30 44 30 L 41 30 C 40.5 30 40 29.601563 40 29 L 40 20 Z"></path>
              </svg>
            </span>
            <span className="flex items-center">Al Jazeera English</span>
            <span>Icono tilde</span>
          </div>
        </div>
      </div>
    </div>
  );
}
