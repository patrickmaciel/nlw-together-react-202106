import {useState} from "react";

type ButtonProps = {
    children?: string,
    type?: string
}

export function Button(props: ButtonProps) {
    /**
     * react does not know when a variables changes
     * only when a STATE changes
     */
    // let counter = 0
    const [counter, setCounter] = useState(0)

    function increment() {
        setCounter(counter + 1)
        // not work because of CLOJURES (TODO: study clojure)
        // console.log(counter)
    }
    return (
        <button type={props.type || 'submit'}
            onClick={increment}>
            { props.children || 'Botão' } - {counter}
        </button>
    )
}

/**
 * diego dont like do it that way
 * this is known by NAMED EXPORT
 * it's work great but doing that you cant have multiple components in the same file
 * and if you change the name, React do not throw an error because
 * it's allow when import to give another name
 *
 * doing in the other way (Diego's way), you export directly in function
 * and it's required to pass the component correctly name when import using
 * { ComponentName }
 */
// export default Button;
