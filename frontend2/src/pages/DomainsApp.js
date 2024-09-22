import React, { useState, useEffect } from 'react'
import { useNavigation } from "@react-navigation/native"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView, Platform } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage'

function Domain({ domains }) {
    const navigation = useNavigation()

    const handleDomainPress = (domainId) => {
        navigation.navigate("Courses", { domainId })
    }

    return (
        <View style={styles.section}>
            {Array.isArray(domains) ? domains.map((domain, index) => (
                <Pressable key={index} onPress={() => handleDomainPress(domain.id)} style={({ pressed }) => [styles.button, { opacity: pressed ? 0.5 : 1 }]}>
                    <Text style={styles.buttonText}>
                        {domain.domain_name}
                    </Text>
                </Pressable>
            )) : <Text>Geen domeinen beschikbaar</Text>}
        </View>
    )
}

function DomainsApp() {
    const [domains, setDomains] = useState([])
    let backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken')
                if (!token) {
                    console.error('Geen token gevonden, log alsjeblieft in.')
                    return
                }

                const response = await fetch(`${backendUrl}/api/domains`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    if (response.status === 401) {
                        console.error('Ongeautoriseerd: Ongeldige token of niet ingelogd.')
                    } else if (response.status === 422) {
                        console.error('Onverwerkbare Entiteit: Ongeldige verzoekgegevens.')
                    } else {
                        console.error('Domeinen ophalen mislukt:', response.statusText)
                    }
                    return
                }

                const data = await response.json()
                setDomains(data)
            } catch (error) {
                console.error('Fout bij het ophalen van domeinen:', error)
            }
        }

        fetchDomains()
    }, [])

    return (
        <View style={Platform.OS === "android" ? styles.container : styles.containerWeb}>
            <NavBar links={[{ screen: 'Homepage', text: 'Home' }, { screen: 'Dashboard', text: 'Dashboard' }]}/>
            <Text style={styles.pageTitle}>Domeinen</Text>
            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <View style={Platform.OS === "android" ? styles.contentPage : styles.contentPageWeb}>
                    <Domain domains={domains}/>
                </View>
            </ScrollView>
            <Footer/>
        </View>
    )
}

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0,
        height: windowHeight,
        backgroundColor: "rgb(247, 243, 231)",
    },
    containerWeb: {
        margin: 0,
        height: windowHeight,
        backgroundColor: "rgb(247, 243, 231)",
    },
    contentPage: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        width: windowWidth,
        gap: 25,
        paddingLeft: 25,
        paddingRight: 25,
    },
    contentPageWeb: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: 750,
        gap: 25,
        paddingLeft: 25,
        paddingRight: 25,
    },
    section: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        color: "black",
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        paddingTop: 50,
        paddingBottom: 50,
    },
    button: {
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "black",
    },
})

export default DomainsApp
