import Navigation from "@/components/Navigation";
import "../globals.css"

export default function HomeLayout({children}: Readonly<{children:React.ReactNode}>){
return(
    <div>
        <Navigation />
        {children}
    </div>
)
}