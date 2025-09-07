import {ChevronDown, ChevronRight} from "lucide-react"
import {useState} from "react"
import {BsStars} from "react-icons/bs"
import PaletteItem from "./PaletteComponent"
import {Block} from "./block"
import Library from "../library/Library"

export default function Palette() {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState<Block[]>(Library)
    const groupedComponents = items.reduce(
        (acc, component) => {
            if (!acc[component.type]) {
                acc[component.type] = []
            }
            acc[component.type].push(component)
            return acc
        },
        {} as Record<string, Block[]>,
    )

    const toggleSection = (type: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [type]: !prev[type],
        }))
    }

    console.log(Library.length)

    const handleSend = async () => {
        if (!message.trim()) return
        setLoading(true)
        try {
            const res = await fetch("https://ui-ai.onrender.com/inline", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({prompt: message}),
            })
            const data = await res.json()
            console.log(data.html)
            console.log(message)
            const accessToken = localStorage.getItem("token")
            console.log(accessToken)
            const res1 = await fetch("https://ui-ai.onrender.com/components/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({description: message, html: data.html}),
            })
            console.log(res1)
            setMessage("")
            setItems((prev) => [
                ...prev,
                {type: "AI Generated", html: data.jsx ?? data.html},
            ])
        } catch (error) {
            console.error("Failed to generate AI component:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col p-2 gap-2 max-h-[45rem] overflow-y-auto overflow-x-hidden rounded-xl">
            {Object.entries(groupedComponents).map(([type, items]) => (
                <div key={type} className="border-b p-2">
                    <button
                        className="flex items-center justify-between w-full text-left p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                        onClick={() => toggleSection(type)}
                    >
                        <span className="font-semibold">{type}</span>
                        {openSections[type] ?
                            <ChevronDown />
                        :   <ChevronRight />}
                    </button>
                    {openSections[type] && (
                        <div className="mt-2 flex flex-col gap-2 pl-4">
                            {items.map((block, i) => (
                                <PaletteItem key={i} block={block} />
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <div className="flex flex-col gap-2 p-2 border-neutral-300">
                <span className="ml-2 font-semibold">
                    Generate a component using AI
                </span>

                <div className="flex flex-col gap-2 p-2 border-neutral-300 mt-2">
                    <textarea
                        placeholder="Suggest some improvements to the current design"
                        className="flex-1 bg-neutral-50 text-black w-11/12 border-neutral-300 border pb-8 rounded-lg resize-none placeholder:text-neutral-400 placeholder:text-md p-2"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && !e.shiftKey && handleSend()
                        }
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className={`p-2 rounded-lg w-36 mt-2 flex flex-row items-center border border-neutral-800 transition-all duration-300 font-semibold
                            ${loading ? "bg-stone-900 cursor-not-allowed text-neutral-50" : "bg-neutral-100 hover:bg-stone-900 hover:text-neutral-50"}`}
                    >
                        {loading ?
                            <>
                                <div role="status" className="mt-[-3px] ml-1">
                                    <svg
                                        aria-hidden="true"
                                        className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-neutral-50"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                </div>
                                <span className="text-sm ml-3">Generating</span>
                            </>
                        :   <>
                                <BsStars />
                                <span className="text-sm ml-2">Generate by AI</span>
                            </>
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}
