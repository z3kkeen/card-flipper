import Image from "next/image"

export default function Home() {
  return (
    <div className="h-full w-full flex gap-36 pt-8 flex-col items-center bg-zinc-900">
      <h1 className="text-white text-3xl tracking-wider"><b>Pick which card game you'd like to play:</b></h1>
      <div className="flex gap-8">
          <a href="/blackjack" className="flex justify-center items-center flex-col bg-red-900 p-5 text-white rounded-md border-2 border-white ">
          <h1 className="tracking-wider text-xl"><strong>Blackjack</strong></h1>
            <Image src="/deck-of-cards.png" alt="deck of cards" width={90} height={90} />
          <p>Click to enter!</p>
        </a>
        <a href="/game" className="flex justify-center items-center flex-col bg-zinc-700 p-5 text-white rounded-md ">
          <h1 className="tracking-wider text-md text-center">Coming soon...</h1>
        </a>
        <a href="/game" className="flex justify-center items-center flex-col bg-zinc-700 p-5 text-white rounded-md ">
          <h1 className="tracking-wider text-md text-center">Coming soon...</h1>
        </a>
        <a href="/game" className="flex justify-center items-center flex-col bg-zinc-700 p-5 text-white rounded-md ">
          <h1 className="tracking-wider text-md text-center">Coming soon...</h1>
        </a>
      </div>
      
    </div>
  );
}
