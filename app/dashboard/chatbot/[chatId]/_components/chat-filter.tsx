import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { SearchIcon, X } from "lucide-react";

interface ChatFilterProps {
    filter: string;
    setFilter: (value: string) => void;
}

export const ChatFilter = ({ filter, setFilter }: ChatFilterProps) => {

    const isAnyFilterModified = !!filter;

    return (
        <div className='relative mx-2 text-xs'>
            <Input
                placeholder="Search chats..."
                className="pl-7 text-xs"
                value={filter}
                onChange={(e) => {
                    setFilter(e.target.value);
                }}
            />
            <SearchIcon className="absolute size-4 left-2 top-1/2 -translate-y-1/2" />
            {isAnyFilterModified && (
                <Button
                    onClick={() => setFilter("")}
                    variant="outline"
                    className="absolute hover:cursor-pointer size-6 rounded right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    <X />
                </Button>
            )}
        </div>
    )
}