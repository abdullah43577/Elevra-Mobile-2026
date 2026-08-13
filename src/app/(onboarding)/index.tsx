import { OnboardingDots } from "@/components/onboarding/onboarding-dots";
import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { onboardingSlides } from "@/constants/onboarding";
import { useOnboardingStore } from "@/store/onboarding";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Onboarding() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const isLastSlide = activeIndex === onboardingSlides.length - 1;

  const handleFinish = async function () {
    await completeOnboarding();
    router.replace("/(auth)/sign-in");
  };

  const handleNext = function () {
    if (isLastSlide) {
      handleFinish();
      return;
    }
    flatListRef.current?.scrollToIndex({
      index: activeIndex + 1,
      animated: true,
    });
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Skip */}
      <View className="flex-row justify-end px-6 pt-2">
        <Pressable onPress={handleFinish} className="active:opacity-60">
          <AppText type="link">Skip</AppText>
        </Pressable>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingSlides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View
            style={{ width: SCREEN_WIDTH }}
            className="flex-1 items-center justify-center px-8"
          >
            <Image
              source={item.image}
              style={{
                width: SCREEN_WIDTH * 0.75,
                height: SCREEN_WIDTH * 0.75,
              }}
              resizeMode="contain"
            />
            <AppText type="title" className="mt-8 text-center">
              {item.title}
            </AppText>
            <AppText
              type="subtitle"
              className="mt-2 text-center text-neutral-500"
            >
              {item.subtitle}
            </AppText>
          </View>
        )}
      />

      {/* Footer: dots + CTA */}
      <View className="gap-6 px-6 pb-8">
        <OnboardingDots
          total={onboardingSlides.length}
          activeIndex={activeIndex}
        />

        <AppButton type="submit" onPress={handleNext}>
          <AppText className="font-bricolage-semibold text-white">
            {isLastSlide ? "Get Started" : "Continue"}
          </AppText>
        </AppButton>
      </View>
    </SafeAreaView>
  );
}
