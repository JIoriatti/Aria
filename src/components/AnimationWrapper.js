import { AnimatePresence, motion } from "framer-motion";

export default function AnimationWrapper ({children}){
    return (
        <AnimatePresence>
            {children}
        </AnimatePresence>
    )
}