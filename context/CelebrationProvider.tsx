import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon'
import React, { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AccessibilityInfo, Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native'

import { ThemedText } from '@/components/themed-text';

type ConfettiContext = {
	celebrate: (message?: string) => void
}

const CelebrationContext = createContext<ConfettiContext>({ celebrate: () => {} })
export const useCelebration = () => useContext(CelebrationContext)

export const CelebrationProvider = ({children}: {children: React.ReactNode}) => {
	const [visible, setVisible] = useState<boolean>(false)
	const [message, setMessage] = useState<string | undefined>(undefined)
	const opacity = useRef(new Animated.Value(0)).current
	const lockRef = useRef<boolean>(false)
	const { width } = useWindowDimensions()

	const celebrate = useCallback(() => {
		(async(message?: string) => {
			if(lockRef.current) return

			lockRef.current = true
			setMessage(message)
			setVisible(true)

			try {
				await Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Success
				)
			} catch{ }

			try {
				AccessibilityInfo.announceForAccessibility?.(message || 'Habit completed!')
			} catch { }

			Animated.timing(opacity, {
				toValue: 1,
				duration: 180,
				easing: Easing.out(Easing.quad),
				useNativeDriver: true
			}).start()

			setTimeout(() => {
				Animated.timing(opacity, {
					toValue: 0,
					duration: 1000,
					easing: Easing.in(Easing.quad),
					useNativeDriver: true
				}).start(({ finished }) => {
					if(finished) {
						setVisible(false)
						setMessage(undefined)
						lockRef.current = false
					}
				})
			})
		})()
	}, [opacity])

	return (
		<CelebrationContext.Provider value={{ celebrate }}>
			{ children }
			{ visible && (
				<Animated.View
					pointerEvents='none'
					style={[ StyleSheet.absoluteFillObject, styles.overlay, { opacity } ]}
				>
					<ConfettiCannon 
						count={60}
						origin={{ x: 0, y: 0 }}
						fadeOut
						autoStart
					/>

					<ConfettiCannon 
						count={60}
						origin={{ x: width, y: 0 }}
						fadeOut
						autoStart
					/>

					<View style={ styles.toast }>
						<ThemedText style={ styles.toastText }>
							{ message || 'Habit completed!' }
						</ThemedText>
					</View>
				</Animated.View>
			)}
		</CelebrationContext.Provider>
	)
}

const styles = StyleSheet.create({
	overlay: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	toast: {
		position: 'absolute',
		bottom: 80,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 14,
		backgroundColor: 'rgba(0, 0, 0, 0.70)'
	},
	toastText: {
		color: '#fff',
		fontWeight: '700'
	}
})