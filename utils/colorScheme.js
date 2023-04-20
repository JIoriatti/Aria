import { ACTIONS } from "./actions";

export const colorScheme =(imageSrc, mainRef, dispatch)=>{
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')
    let imageDataArray;

    const initCanvas =()=>{
        const songImage = document.createElement('img');
        songImage.crossOrigin = "Anonymous";
        songImage.src = imageSrc;

        songImage.onload = ()=>{
            canvas.width = songImage.naturalWidth;
            canvas.height = songImage.naturalHeight;
            
            ctx.drawImage(songImage, 0, 0);
            imageDataArray = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height,
            )
            const edges = getEdges();
            const allPixels = getAllPixels();
        
            setBackgroundGradient(
                getAverageColor(edges.top), 
                getAverageColor(edges.bottom),
                getAverageColor(edges.left),
                getAverageColor(edges.right),
            );
        }
    }

    const getAllPixels = ()=>{
        const rowLength = canvas.width * 4;
        const numberOfRows = (imageDataArray.data.length)/rowLength
        let allPixels =[];
        for(let r=0; r<numberOfRows; r++){
            for(let c = r * rowLength; c < rowLength; c+=4){
                allPixels.push({
                    red: imageDataArray.data[c],
                    green: imageDataArray.data[c + 1],
                    blue: imageDataArray.data[c + 2],
                    alpha: imageDataArray.data[c + 3],
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
        const rowLength = canvas.width * 4;
        console.log(rowLength)
        const numberOfRows = (imageDataArray.data.length)/rowLength
        for(let i=0; i<numberOfRows; i++){
            let leftEdgeIndex = i * rowLength;
            let rightEdgeIndex = (i * rowLength) -4;

            //top edge
            if(i === 0){
                for(let c = 0; c<(rowLength); c+=4){
                    topEdgePixels.push({
                        red: imageDataArray.data[c],
                        green: imageDataArray.data[c + 1],
                        blue: imageDataArray.data[c + 2],
                        alpha: imageDataArray.data[c + 3],
                    })
                }
            }
            //bottom edge
            if(i === (numberOfRows -1)){
                for(let h = (imageDataArray.data.length - rowLength); h<imageDataArray.data.length; h+=4){
                    bottomEdgePixels.push({
                        red: imageDataArray.data[h],
                        green: imageDataArray.data[h + 1],
                        blue: imageDataArray.data[h + 2],
                        alpha: imageDataArray.data[h + 3],
                    })
                }
            }
            
            //left edge
            leftEdgePixels.push({
                red: imageDataArray.data[leftEdgeIndex],
                green: imageDataArray.data[leftEdgeIndex + 1],
                blue: imageDataArray.data[leftEdgeIndex + 2],
                alpha: imageDataArray.data[leftEdgeIndex + 3],

            })
            //right edge
            if(i>0){
                rightEdgePixels.push({
                    red: imageDataArray.data[rightEdgeIndex],
                    green: imageDataArray.data[rightEdgeIndex + 1],
                    blue: imageDataArray.data[rightEdgeIndex + 2],
                    alpha: imageDataArray.data[rightEdgeIndex + 3],
    
                })
            }
            if(i === (numberOfRows - 1)){
                rightEdgePixels.push({
                    red: imageDataArray.data[imageDataArray.data.length - 4],
                    green: imageDataArray.data[imageDataArray.data.length - 3],
                    blue: imageDataArray.data[imageDataArray.data.length - 2],
                    alpha: imageDataArray.data[imageDataArray.data.length -1],
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
    
    const setBackgroundGradient =(avgColorTop, avgColorBot, avgColorLeft, avgColorRight)=>{
        const CAP = 110;
        const aRGBTop = (avgColorTop.r + avgColorTop.g + avgColorTop.b)/3
        const aRGBBot = (avgColorBot.r + avgColorBot.g + avgColorBot.b)/3
        const aRGBRight = (avgColorRight.r + avgColorRight.g + avgColorRight.b)/3
        const aRGBLeft = (avgColorLeft.r + avgColorLeft.g + avgColorLeft.b)/3
        let transparentPercent = 40;
        let visibilityTop = 0;
        let visibilityBot = 0;
        let visibilityRight = 0;
        let visibilityLeft = 0;
        
        const backgroundAnimationId = setInterval(()=>{
            
            mainRef.style.background = `linear-gradient(to bottom, #0f0f0f, rgb(${avgColorTop.r}, ${avgColorTop.g},${avgColorTop.b},${visibilityTop}), rgb(${avgColorBot.r}, ${avgColorBot.g},${avgColorBot.b},${visibilityBot}), #0f0f0f),
            linear-gradient(to right, rgb(${avgColorLeft.r}, ${avgColorLeft.g},${avgColorLeft.b},${visibilityLeft}) 20%, transparent, rgb(${avgColorRight.r}, ${avgColorRight.g},${avgColorRight.b},${visibilityRight}) 80%)`
            if(transparentPercent< 70){
                transparentPercent += 0.02
            }
            if(aRGBTop > CAP){
                visibilityTop += 0.0001
            }
            else{
                visibilityTop += 0.0003
            }
            if(aRGBBot > CAP){
                visibilityBot += 0.0001
            }
            else{
                visibilityBot += 0.0003
            }
            if(aRGBRight > CAP){
                visibilityRight += 0.0001
            }
            else{
                visibilityRight += 0.0003
            }
            if(aRGBLeft > CAP){
                visibilityLeft += 0.0001
            }
            else{
                visibilityLeft += 0.0003
            }
        },1)
        setTimeout(()=>{
            clearInterval(backgroundAnimationId)
        },10000) 
        
        dispatch({type: ACTIONS.SET_INTERVAL, payload: backgroundAnimationId})
    }
    
    initCanvas();
}

