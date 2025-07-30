import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logging out...");
    // Add logout logic here
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 bg-primary/10 hover:bg-primary/20 text-primary font-semibold"
        >
          JD
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="glass border bg-card text-card-foreground"
      >
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive hover:text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}