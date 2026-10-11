import { ReactNode } from "react";
import { Text, TextProps, View } from "react-native";
import { BaseTheme } from "../../../../types/resume/theme";

// Never AppText in a resume: it is theme-adaptive and would turn body copy white in
// dark mode. RText takes an explicit colour.

export const PAGE = { width: 794, aspect: 1.414 }; // A4 at 96dpi

export interface ResumeStyle {
  scale: number;
  accent: string;
  heading: string;
  text: string;
  muted: string;
  rule: string;
  gap: number;
  px: (value: number) => number;
}

const SPACING_FACTOR = { COMPACT: 0.75, NORMAL: 1, SPACIOUS: 1.35 } as const;

export const buildResumeStyle = function (
  theme: BaseTheme & { accentColor?: string },
  isThumbnail = false,
): ResumeStyle {
  const scale = isThumbnail ? 0.42 : 1;
  const spacing = SPACING_FACTOR[theme.spacing] ?? 1;
  const px = (value: number) => Math.max(1, Math.round(value * scale));

  return {
    scale,
    accent: theme.accentColor ?? theme.primaryColor,
    heading: theme.primaryColor,
    text: theme.textColor ?? "#1F2328",
    muted: "#5B6169",
    rule: "#D8DCE1",
    gap: px(18 * spacing),
    px,
  };
};

interface RTextProps extends TextProps {
  size: number;
  color: string;
  weight?: "regular" | "medium" | "semibold" | "bold";
  spacingPx?: number;
  style?: TextProps["style"];
}

const WEIGHTS = {
  regular: "BricolageGrotesque-Regular",
  medium: "BricolageGrotesque-Medium",
  semibold: "BricolageGrotesque-SemiBold",
  bold: "BricolageGrotesque-Bold",
} as const;

export const RText = function ({
  size,
  color,
  weight = "regular",
  spacingPx,
  style,
  ...rest
}: RTextProps) {
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: WEIGHTS[weight],
          fontSize: size,
          lineHeight: Math.round(size * 1.38),
          color,
          ...(spacingPx !== undefined && { letterSpacing: spacingPx }),
        },
        style,
      ]}
    />
  );
};

export const ResumePage = function ({
  children,
  style,
  padding,
}: {
  children: ReactNode;
  style: ResumeStyle;
  padding?: number;
}) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        padding: padding ?? style.px(38),
      }}
    >
      {children}
    </View>
  );
};

// Parsers key off these exact conventional headings; do not rename them.
export const SectionTitle = function ({
  label,
  style,
  variant = "rule",
}: {
  label: string;
  style: ResumeStyle;
  variant?: "rule" | "plain" | "boxed";
}) {
  const size = style.px(11);

  if (variant === "boxed") {
    return (
      <View
        style={{
          backgroundColor: style.accent,
          paddingHorizontal: style.px(8),
          paddingVertical: style.px(4),
          marginBottom: style.px(8),
          alignSelf: "flex-start",
        }}
      >
        <RText size={size} color="#FFFFFF" weight="bold" spacingPx={style.px(1)}>
          {label.toUpperCase()}
        </RText>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: style.px(8) }}>
      <RText size={size} color={style.heading} weight="bold" spacingPx={style.px(1.2)}>
        {label.toUpperCase()}
      </RText>
      {variant === "rule" && (
        <View
          style={{
            height: style.px(2),
            backgroundColor: style.accent,
            marginTop: style.px(4),
          }}
        />
      )}
    </View>
  );
};

export const Section = function ({
  label,
  style,
  variant,
  children,
}: {
  label: string;
  style: ResumeStyle;
  variant?: "rule" | "plain" | "boxed";
  children: ReactNode;
}) {
  return (
    <View style={{ marginBottom: style.gap }}>
      <SectionTitle label={label} style={style} {...(variant && { variant })} />
      {children}
    </View>
  );
};

// Dates stay on the role's row: the layout parsers handle most reliably.
export const Entry = function ({
  title,
  organisation,
  dates,
  meta,
  style,
  children,
}: {
  title: string;
  organisation?: string;
  dates?: string;
  meta?: string;
  style: ResumeStyle;
  children?: ReactNode;
}) {
  return (
    <View style={{ marginBottom: style.px(12) }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <RText size={style.px(13)} color={style.text} weight="semibold" style={{ flex: 1, paddingRight: style.px(8) }}>
          {title}
        </RText>
        {!!dates && (
          <RText size={style.px(10)} color={style.muted}>
            {dates}
          </RText>
        )}
      </View>

      {!!organisation && (
        <RText size={style.px(11)} color={style.accent} weight="medium" style={{ marginTop: style.px(1) }}>
          {organisation}
          {meta ? ` · ${meta}` : ""}
        </RText>
      )}

      {children}
    </View>
  );
};

export const Paragraph = function ({ text, style }: { text: string; style: ResumeStyle }) {
  return (
    <RText size={style.px(11)} color={style.text} style={{ marginTop: style.px(4) }}>
      {text}
    </RText>
  );
};

// Real bullet characters in text nodes; parsers cannot read icon fonts or images.
export const Bullets = function ({ items, style }: { items: string[]; style: ResumeStyle }) {
  if (items.length === 0) return null;

  return (
    <View style={{ marginTop: style.px(4) }}>
      {items.map((item, index) => (
        <View key={index} style={{ flexDirection: "row", marginBottom: style.px(2) }}>
          <RText size={style.px(11)} color={style.text} style={{ width: style.px(12) }}>
            •
          </RText>
          <RText size={style.px(11)} color={style.text} style={{ flex: 1 }}>
            {item}
          </RText>
        </View>
      ))}
    </View>
  );
};

// A comma-joined run, not chips: parsers read chips as separate fragments.
export const InlineList = function ({ items, style }: { items: string[]; style: ResumeStyle }) {
  if (items.length === 0) return null;

  return (
    <RText size={style.px(11)} color={style.text}>
      {items.join("  ·  ")}
    </RText>
  );
};

export const ContactLine = function ({
  items,
  style,
  color,
  align = "center",
}: {
  items: (string | undefined)[];
  style: ResumeStyle;
  color?: string;
  align?: "center" | "left";
}) {
  const present = items.filter(Boolean) as string[];
  if (present.length === 0) return null;

  return (
    <RText
      size={style.px(10)}
      color={color ?? style.muted}
      style={{ textAlign: align, marginTop: style.px(5) }}
    >
      {present.join("   |   ")}
    </RText>
  );
};

export const Rule = function ({ style, color }: { style: ResumeStyle; color?: string }) {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: color ?? style.rule,
        marginBottom: style.gap,
      }}
    />
  );
};
