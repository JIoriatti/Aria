import { ACTIONS } from "./actions";


export const fadeOutAnimation = (dispatch, state, mainRef) => {
    const CAP = 110;
    const AVG_COLOR_THRESHOLD = 14;
    const TIMER = 1500;
    const MS = 10;
    let fadeOutId;
    const aRGBTop = (state.colorObj.top.r + state.colorObj.top.g + state.colorObj.top.b) / 3
    const aRGBBot = (state.colorObj.bottom.r + state.colorObj.bottom.g + state.colorObj.bottom.b) / 3
    const aRGBRight = (state.colorObj.right.r + state.colorObj.right.g + state.colorObj.right.b) / 3
    const aRGBLeft = (state.colorObj.left.r + state.colorObj.left.g + state.colorObj.left.b) / 3

    const average = (aRGBTop + aRGBBot + aRGBLeft + aRGBRight) / 4
    let currentVisObj = state.visibilityObj;

        fadeOutId = setInterval(() => {
            if (average < AVG_COLOR_THRESHOLD) {
                mainRef.current.style.background = `linear-gradient(to bottom, #0f0f0f, rgb(${state.colorObj.all.r}, ${state.colorObj.all.g},${state.colorObj.all.b},${state.visibilityObj.top}), rgb(${state.colorObj.all.r}, ${state.colorObj.all.g},${state.colorObj.all.b},${state.visibilityObj.bottom}), #0f0f0f),
              linear-gradient(to right, rgb(${state.colorObj.all.r}, ${state.colorObj.all.g},${state.colorObj.all.b},${state.visibilityObj.left}) 20%, transparent, rgb(${state.colorObj.all.maxPixel.red}, ${state.colorObj.all.maxPixel.green},${state.colorObj.all.maxPixel.blue},${state.visibilityObj.right}) 80%)`
            }
            else {
                mainRef.current.style.background = `linear-gradient(to bottom, #0f0f0f, rgb(${state.colorObj.top.r}, ${state.colorObj.top.g},${state.colorObj.top.b},${state.visibilityObj.top}), rgb(${state.colorObj.bottom.r}, ${state.colorObj.bottom.g},${state.colorObj.bottom.b},${state.visibilityObj.bottom}), #0f0f0f),
              linear-gradient(to right, rgb(${state.colorObj.left.r}, ${state.colorObj.left.g},${state.colorObj.left.b},${state.visibilityObj.left}) 20%, transparent, rgb(${state.colorObj.right.r}, ${state.colorObj.right.g},${state.colorObj.right.b},${state.visibilityObj.right}) 80%)`
            }
            
                
                if (state.visibilityObj.top - (currentVisObj.top/(TIMER/MS)+0.003) > 0) {
                    dispatch({
                        type: ACTIONS.SET_VISIBILITY_OBJ, payload: {
                            top: state.visibilityObj.top -= (currentVisObj.top/(TIMER/MS)+0.003),
                            bottom: state.visibilityObj.bottom -= (currentVisObj.bottom/(TIMER/MS)+0.003),
                            right: state.visibilityObj.right -= (currentVisObj.right/(TIMER/MS)+0.003),
                            left: state.visibilityObj.left -= (currentVisObj.left/(TIMER/MS)+0.003)
                        }
                    })
                }
                else {
                    dispatch({
                        type: ACTIONS.SET_VISIBILITY_OBJ, payload: {
                            top: state.visibilityObj.top = 0,
                            bottom: state.visibilityObj.bottom = 0,
                            right: state.visibilityObj.right = 0,
                            left: state.visibilityObj.left = 0,
                        }
                    })
                }
        }, MS)
    
        setTimeout(() => {
            clearInterval(fadeOutId);
        }, TIMER)
    
        return fadeOutId;
}

export const fadeInAnimation = (dispatch, state, mainRef) => {
    const CAP = 110;
    const AVG_COLOR_THRESHOLD = 14;
    const aRGBTop = (state.colorObj.top.r + state.colorObj.top.g + state.colorObj.top.b) / 3
    const aRGBBot = (state.colorObj.bottom.r + state.colorObj.bottom.g + state.colorObj.bottom.b) / 3
    const aRGBRight = (state.colorObj.right.r + state.colorObj.right.g + state.colorObj.right.b) / 3
    const aRGBLeft = (state.colorObj.left.r + state.colorObj.left.g + state.colorObj.left.b) / 3
    let transparentPercent = 40;
    const average = (aRGBTop + aRGBBot + aRGBLeft + aRGBRight) / 4
    const backgroundAnimationId = setInterval(() => {
        //use max pixel color of image if the edges are darker than the threshold
        //of 30
        if (average < AVG_COLOR_THRESHOLD) {
            mainRef.current.style.background = `linear-gradient(to bottom, #0f0f0f, rgb(${state.colorObj.all.r}, ${state.colorObj.all.g},${state.colorObj.all.b},${state.visibilityObj.top}), rgb(${state.colorObj.all.r}, ${state.colorObj.all.g},${state.colorObj.all.b},${state.visibilityObj.bottom}), #0f0f0f),
          linear-gradient(to right, rgb(${state.colorObj.all.r}, ${state.colorObj.all.g},${state.colorObj.all.b},${state.visibilityObj.left}) 20%, transparent, rgb(${state.colorObj.all.maxPixel.red}, ${state.colorObj.all.maxPixel.green},${state.colorObj.all.maxPixel.blue},${state.visibilityObj.right}) 80%)`
        }
        else {
            mainRef.current.style.background = `linear-gradient(to bottom, #0f0f0f, rgb(${state.colorObj.top.r}, ${state.colorObj.top.g},${state.colorObj.top.b},${state.visibilityObj.top}), rgb(${state.colorObj.bottom.r}, ${state.colorObj.bottom.g},${state.colorObj.bottom.b},${state.visibilityObj.bottom}), #0f0f0f),
          linear-gradient(to right, rgb(${state.colorObj.left.r}, ${state.colorObj.left.g},${state.colorObj.left.b},${state.visibilityObj.left}) 20%, transparent, rgb(${state.colorObj.right.r}, ${state.colorObj.right.g},${state.colorObj.right.b},${state.visibilityObj.right}) 80%)`
        }
        if (transparentPercent < 70) {
            transparentPercent += 0.04
        }
        if (average > CAP) {
            dispatch({
                type: ACTIONS.SET_VISIBILITY_OBJ, payload: {
                    ...state.visibilityObj,
                    top: state.visibilityObj.top += 0.0004,
                    bottom: state.visibilityObj.bottom += 0.0004,
                    right: state.visibilityObj.right += 0.0004,
                    left: state.visibilityObj.left += 0.0004,
                }
            })
        }
        else {
            dispatch({
                type: ACTIONS.SET_VISIBILITY_OBJ, payload: {
                    ...state.visibilityObj,
                    top: state.visibilityObj.top += 0.0008,
                    bottom: state.visibilityObj.bottom += 0.0008,
                    right: state.visibilityObj.right += 0.0008,
                    left: state.visibilityObj.left += 0.0008,
                }
            })
        }
    }, 10)

    setTimeout(() => {
        clearInterval(backgroundAnimationId)
    }, 7000)

    dispatch({ type: ACTIONS.SET_INTERVAL, payload: backgroundAnimationId })
    return backgroundAnimationId;
}  
