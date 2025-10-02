// import { useEffect, useState } from "react";

// const Card = ({ title }) => {
//     const [hasLiked, setHasLiked] = useState(false);
//     const [count, setCount] = useState(0);

//     useEffect(() => {
//         console.log(`${title} has been liked: ${hasLiked}`)
//     }, [hasLiked]);

//     return (
//         <div className="card" onClick={() => setCount((prev) => prev + 1)}>
//             <h2>{title} <br /> {count || null}</h2>
//             <button onClick={() => setHasLiked(!hasLiked)}>{hasLiked ? '🤩' : 'Like'}</button>
//         </div>
//     )
// }

// export default Card;