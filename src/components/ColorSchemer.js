import { useEffect, useRef, useState } from 'react'
import styles from './ColorSchemer.module.css'


export default function ColorSchemer({image}){
    const canvasRef = useRef();
    const backgroundRef = useRef();
    const [songImageDataArray, setSongImageDataArray] = useState(null);
    const colorArrayRef = useRef();

    const initCanvas =()=>{
        const ctx = canvasRef.current.getContext('2d')
        const songImage = document.createElement('img');
        songImage.crossOrigin = "Anonymous";
        songImage.src = image;

        songImage.onload = ()=>{
            canvasRef.current.width = songImage.naturalWidth;
            canvasRef.current.height = songImage.naturalHeight;
            
            ctx.drawImage(songImage, 0, 0);
            colorArrayRef.current = ctx.getImageData(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height,
            )
            const edges = getEdges();
            const allPixels = getAllPixels();
          
            colorFade(edges.top, 'top');
            colorFade(edges.bottom, 'bottom');
           
            backgroundRadialGradient(getAverageColor(edges.total));
        }
    }

    const getAllPixels = ()=>{
        const rowLength = canvasRef.current.width * 4;
        const numberOfRows = (colorArrayRef.current.data.length)/rowLength
        let allPixels =[];
        for(let r=0; r<numberOfRows; r++){
            for(let c = r * rowLength; c < rowLength; c+=4){
                allPixels.push({
                    red: colorArrayRef.current.data[c],
                    green: colorArrayRef.current.data[c + 1],
                    blue: colorArrayRef.current.data[c + 2],
                    alpha: colorArrayRef.current.data[c + 3],
                })
            }
        }
        return allPixels;
    }

    const getEdges =()=>{
        let leftEdgePixels = [];
        let rightEdgePixels = [];
        let topEdgePixels = [];
        let bottomEdgePixels = [];
        const rowLength = canvasRef.current.width * 4;
        const numberOfRows = (colorArrayRef.current.data.length)/rowLength
        for(let i=0; i<numberOfRows; i++){
            let leftEdgeIndex = i * rowLength;
            let rightEdgeIndex = (i * rowLength) -4;

            //top edge
            if(i === 0){
                for(let c = 0; c<(rowLength); c+=4){
                    topEdgePixels.push({
                        red: colorArrayRef.current.data[c],
                        green: colorArrayRef.current.data[c + 1],
                        blue: colorArrayRef.current.data[c + 2],
                        alpha: colorArrayRef.current.data[c + 3],
                    })
                }
            }
            //bottom edge
            if(i === (numberOfRows -1)){
                for(let h = (colorArrayRef.current.data.length - rowLength); h<colorArrayRef.current.data.length; h+=4){
                    bottomEdgePixels.push({
                        red: colorArrayRef.current.data[h],
                        green: colorArrayRef.current.data[h + 1],
                        blue: colorArrayRef.current.data[h + 2],
                        alpha: colorArrayRef.current.data[h + 3],
                    })
                }
            }
            
            //left edge
            leftEdgePixels.push({
                red: colorArrayRef.current.data[leftEdgeIndex],
                green: colorArrayRef.current.data[leftEdgeIndex + 1],
                blue: colorArrayRef.current.data[leftEdgeIndex + 2],
                alpha: colorArrayRef.current.data[leftEdgeIndex + 3],

            })
            //right edge
            if(i>0){
                rightEdgePixels.push({
                    red: colorArrayRef.current.data[rightEdgeIndex],
                    green: colorArrayRef.current.data[rightEdgeIndex + 1],
                    blue: colorArrayRef.current.data[rightEdgeIndex + 2],
                    alpha: colorArrayRef.current.data[rightEdgeIndex + 3],
    
                })
            }
            if(i === (numberOfRows - 1)){
                rightEdgePixels.push({
                    red: colorArrayRef.current.data[colorArrayRef.current.data.length - 4],
                    green: colorArrayRef.current.data[colorArrayRef.current.data.length - 3],
                    blue: colorArrayRef.current.data[colorArrayRef.current.data.length - 2],
                    alpha: colorArrayRef.current.data[colorArrayRef.current.data.length -1],
                })
            }
        }

        const totalEdgePixels = [...leftEdgePixels, ...rightEdgePixels, ...topEdgePixels, ...bottomEdgePixels];

        return {
            top: topEdgePixels,
            right: rightEdgePixels,
            bottom: bottomEdgePixels,
            left: leftEdgePixels,
            total: totalEdgePixels,
        }
    }

    const getAverageColor =(edge)=>{
        let r=0;
        let g=0;
        let b=0;
        let a=0;
        let total=0;
        edge.forEach((pixel,i)=>{
            r += pixel.red
            g += pixel.green
            b += pixel.blue
            a += pixel.alpha
            total++;
        })
        r = r/total;
        g = g/total;
        b = b/total;
        a = a/total;
        return {
            r, g, b, a
        }
    }


//Left-Edge = first index of every row
//Right-Edge = last index of every row
//Top-Edge = entire first row
//Bottom-Edge = entire last row

//image width is the length of each row

//length of image data array (~8 million for test image) is
//total number of pixels/indecies in array

//dataArray.length / image-width should equal number of rows.

    const drawPixel =(ctx, pixel, pixelData, x, y, edge, lineXstart, opacityReducer)=>{
        pixelData[0] = edge[x -lineXstart].red;
        pixelData[1] = edge[x -lineXstart].green;
        pixelData[2] = edge[x -lineXstart].blue;
        if(opacityReducer>0){
            pixelData[3] = edge[x -lineXstart].alpha * opacityReducer;
        }
        else{
            pixelData[3] = 0
        }
        ctx.putImageData(pixel, x, y)
    }

    const colorFade = (edge, name)=>{
        const backgroundCtx = backgroundRef.current.getContext('2d');
        const pixel = backgroundCtx.createImageData(1,1);
        const pixelData = pixel.data;

        const backgroundDimensions = backgroundRef.current.getBoundingClientRect();
        const canvasDimensions = canvasRef.current.getBoundingClientRect();
    
        const backgroundWidth = backgroundDimensions.width;
        const backgroundHeight = backgroundDimensions.height;
        
        let lineXStart;
        let lineYStart;
        let opacityReducer = 1;
        let multiplier = 1;

        if(name === 'top'){
            lineYStart = ((backgroundDimensions.top + backgroundHeight/2) - (canvasDimensions.height/2))
            lineXStart = ((backgroundDimensions.left + backgroundWidth/2) - (canvasDimensions.width/2))
            for(let y = lineYStart; y > 100; y--){
                opacityReducer -= (0.02 / (multiplier));
                multiplier /= 1/1.02 
                for(let x=lineXStart; x<(lineXStart + canvasDimensions.width); x++){
                    drawPixel(backgroundCtx, pixel, pixelData, x, y, edge, lineXStart, opacityReducer)
                }
                lineXStart+=1
            }
        }
        if(name === 'bottom'){
            lineYStart = ((backgroundDimensions.bottom - backgroundHeight/2) + (canvasDimensions.height/2)) -1
            lineXStart = ((backgroundDimensions.left + backgroundWidth/2) - (canvasDimensions.width/2))
            for(let y = lineYStart; y< (lineYStart +100); y++){
                opacityReducer -= (0.03 / (multiplier));
                multiplier /= 1/1.03 
                for(let x=lineXStart; x<(lineXStart + canvasDimensions.width); x++){
                    drawPixel(backgroundCtx, pixel, pixelData, x, y, edge, lineXStart, opacityReducer)
                }
                lineXStart+=1
            }
        }
        // if(name === 'full'){
        //     lineYStart = ((backgroundDimensions.bottom - backgroundHeight/2) + (canvasDimensions.height/2)) -1
        //     lineXStart = ((backgroundDimensions.left + backgroundWidth/2) - (canvasDimensions.width/2))
        //     for(let y = lineYStart; y< (lineYStart +100); y++){
        //         opacityReducer -= (0.03 / (multiplier));
        //         multiplier /= 1/1.03 
        //         for(let x=lineXStart; x<(lineXStart + canvasDimensions.width); x++){
        //             drawPixel(backgroundCtx, pixel, pixelData, x, y, edge, lineXStart, opacityReducer)
        //         }
        //         lineXStart+=1
        //     }
        // }
    }

    const backgroundRadialGradient =(avgColorObj)=>{
        backgroundRef.current.style.background = `radial-gradient(rgb(${avgColorObj.r},${avgColorObj.g},${avgColorObj.b},${avgColorObj.a}), transparent)`
    }


    useEffect(()=>{
        initCanvas();
    },[])
    return (
        <div className={styles.container}>
            <canvas
                className={styles.background}
                ref={backgroundRef}
                height={800}
                width={800}
            >
            </canvas>
            <canvas
                className={styles.canvas}
                ref={canvasRef}
            ></canvas>
        </div>
    )
}