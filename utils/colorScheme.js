import { ACTIONS } from "./actions";

export const colorScheme =(imageSrc, dispatch, state)=>{
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
            if(state.isSongPlaying){
                setTimeout(()=>{
                    dispatch({type: ACTIONS.SET_COLOR_OBJ, payload: {
                        top: getAverageColor(edges.top),
                        bottom: getAverageColor(edges.bottom),
                        left: getAverageColor(edges.left),
                        right: getAverageColor(edges.right),
                        all: getAverageColor(allPixels),
                    }})
                  },1500)
            }
            else{
                dispatch({type: ACTIONS.SET_COLOR_OBJ, payload: {
                    top: getAverageColor(edges.top),
                    bottom: getAverageColor(edges.bottom),
                    left: getAverageColor(edges.left),
                    right: getAverageColor(edges.right),
                    all: getAverageColor(allPixels),
                }})
            }
        }
    }

    const getAllPixels = ()=>{
        const rowLength = canvas.width * 4;
        const numberOfRows = (imageDataArray.data.length)/rowLength
        let allPixels =[];
        for(let r=0; r<numberOfRows; r++){
            for(let c = r * rowLength; c < (r * rowLength) + rowLength; c+=4){
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
    
        let maxPixel = edge.filter((pixel)=>{
            return ((pixel.red + pixel.green + pixel.blue)/3) < 80
        }).reduce((a,b)=>{
            return {
                red: Math.max(a.red,b.red),
                green: Math.max(a.green,b.green),
                blue: Math.max(a.blue,b.blue),
            }  
        }, {red: 0, green: 0, blue: 0})

        r = r/total;
        g = g/total;
        b = b/total;
        a = a/total;
        return {
            r, g, b, a, maxPixel
        }
    }

    initCanvas();
}

