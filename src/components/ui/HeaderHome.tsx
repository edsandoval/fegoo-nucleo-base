import { View, Text, Image, TouchableOpacity } from 'react-native'
import { assets } from '../../../constants'
import { colors, styles } from '../../theme/AppTheme';

interface Props {
    title: string;
    subtitle?: string;
    afilliated?: string;
}

const HeaderHome = ({ title, subtitle, afilliated }: Props) => {

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
                            <Text style={{
                                color: colors.secondary,
                                fontSize: 16,
                                paddingTop: 7,
                            }}>
                                {subtitle}
                            </Text>
                            <Text style={{
                                color: colors.tertiary,
                                fontSize: 15,
                                paddingTop: 16,
                            }}>
                                {afilliated}
                            </Text>
                        </View>
                        <View style={{ height: '100%', marginRight: 40 }}>
                            <Image source={assets.profile} />
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

export default HeaderHome;
