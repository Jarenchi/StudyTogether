"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

// Define the type for the topic
type Topic = Record<"value" | "label", string>;

// Common study group topics
const TOPICS: Topic[] = [
  {
    value: "javascript",
    label: "JavaScript",
  },
  {
    value: "typescript",
    label: "TypeScript",
  },
  {
    value: "react",
    label: "React",
  },
  {
    value: "vue",
    label: "Vue.js",
  },
  {
    value: "angular",
    label: "Angular",
  },
  {
    value: "python",
    label: "Python",
  },
  {
    value: "java",
    label: "Java",
  },
  {
    value: "cplusplus",
    label: "C++",
  },
] as Topic[];

// Define the props for FancyMultiSelect
interface FancyMultiSelectProps {
  onChange: (selected: Topic[]) => void;
}

// FancyMultiSelect component
export function FancyMultiSelect({ onChange }: FancyMultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Topic[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  // Function to handle unselecting a topic
  const handleUnselect = React.useCallback((topic: Topic) => {
    setSelected((prev) => prev.filter((s) => s.value !== topic.value));
  }, []);

  // Function to handle selecting a topic
  const handleSelect = React.useCallback(
    (topic: Topic) => {
      setInputValue("");
      setSelected((prev) => {
        const newSelected = [...prev, topic];
        onChange(newSelected);
        return newSelected;
      });
    },
    [onChange],
  );

  // Function to handle keyboard events
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      // This is not a default behavior of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, []);

  // Filter the topics that are not selected
  const selectables = TOPICS.filter((topic) => !selected.includes(topic));

  // Render the FancyMultiSelect component
  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((topic) => (
            <Badge key={topic.value} variant="secondary">
              {topic.label}
              <button
                type="button"
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(topic);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(topic)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select topics..."
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((topic) => (
                <CommandItem
                  key={topic.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onSelect={() => handleSelect(topic)}
                  className="cursor-pointer"
                >
                  {topic.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
