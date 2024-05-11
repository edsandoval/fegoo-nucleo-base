import { StyleSheet } from "react-native";

//colors

export const colors = {
    primary: '#E72328',
    secondary: '#ffffff',
    tertiary: '#000000',
    //colors in palette,
    strong_gray: '#4B4545',
    light_gray: '#CDD4D9'
}

//general styles

export const styles = StyleSheet.create({
    boxShadows: {
        shadowColor: colors.strong_gray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    backButton: {
        position: 'absolute',
        zIndex: 999,
        elevation: 9,
        top: 50,
        left:18
    }
})
