import { View, Text, Image, TouchableOpacity } from 'react-native'
import { assets } from '../../../constants'
import { colors, styles } from '../../theme/AppTheme';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    title: string;
}

const Header = ({ title }: Props) => {

    return (
        <>
            <View style={{
                backgroundColor: colors.primary,
                height: 180,
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomWidth: 0.7, 
                borderColor: '#CDD4D9'
            }}>

                <View style={{ width: '100%', height: 70, position: 'absolute', bottom: 0 }}>
                    <Image
                        source={assets.background}
                        style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "cover",
                            zIndex: -5555
                        }}
                    />
                    <View style={{
                        width: '100%',
                        height: 120,
                        position: 'absolute',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginLeft: 20,
                        bottom: 0
                    }}
                    >
                        <View style={{ marginTop: 15 }}>
                            <Text style={{
                                color: colors.secondary,
                                fontSize: 22,
                                fontWeight: 'bold',
                                paddingTop: 10,
                            }}>
                                {title}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.backButton}>
                    <TouchableOpacity
                    //onPress={() => navigation.pop()}
                    >
                        <Icon
                            color="white"
                            name="arrow-back-outline"
                            size={30}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

export default Header;
