import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  AppHeader,
  AppText,
  AuthBlock,
  Button,
  CategoryCard,
  EmptyStateBlock,
  FormStepBlock,
  Icon,
  MatchingProgress,
  OnboardingBlock,
  PasswordInput,
  PhoneInput,
  PhotoUploader,
  ProfessionalCard,
  QuoteBlock,
  QuoteCard,
  RequestSummaryBlock,
  SearchInput,
  TextInput,
  TrackingBlock,
  colors,
  spacing,
} from '../../design-system';

export const DesignSystemPreview = () => (
  <View style={styles.screen}>
    <AppHeader title="Design System" subtitle="Pro24Home v0.3" leftIcon="arrowLeft" rightIcon="bell" />

    <ScrollView contentContainerStyle={styles.content}>
      <Section title="v0.1 — Foundations + Icons + UI">
        <Button title="Primary Button" leftIcon="check" />
        <Button title="Secondary Button" variant="secondary" />
        <Button title="Outline Button" variant="outline" />
        <TextInput label="Nom" placeholder="Votre nom" />
        <PhoneInput label="Téléphone" placeholder="+33 6 00 00 00 00" />
        <PasswordInput label="Mot de passe" placeholder="••••••••" />
        <SearchInput placeholder="Rechercher" />

        <View style={styles.iconGrid}>
          {['home', 'plumbing', 'locksmith', 'electricity', 'airConditioning', 'location', 'camera', 'bell'].map((name) => (
            <View key={name} style={styles.iconItem}>
              <Icon name={name as any} color={colors.primary[600]} />
              <AppText variant="caption" align="center">{name}</AppText>
            </View>
          ))}
        </View>
      </Section>

      <Section title="v0.2 — Business Components">
        <CategoryCard title="Plomberie" subtitle="Fuite, WC bouchés" icon="plumbing" selected />
        <CategoryCard title="Serrurerie" subtitle="Porte claquée, clé cassée" icon="locksmith" />
        <ProfessionalCard name="Karim Benali" job="Plombier" eta="12 min" distance="4,2 km" rating={4.8} verified />
        <QuoteCard price="85 €" description="Déplacement + diagnostic estimatif." />
        <MatchingProgress />
        <PhotoUploader count={2} max={5} onPress={() => {}} />
      </Section>

      <Section title="v0.3 — UX Blocks">
        <View style={styles.blockPreview}>
          <OnboardingBlock
            icon="tools"
            title="Trouvez un professionnel qualifié en quelques minutes."
            description="Décrivez votre problème et Pro24Home trouve automatiquement le professionnel le plus adapté."
            current={0}
            total={3}
            primaryLabel="Suivant"
            secondaryLabel="Ignorer"
            onPrimaryPress={() => {}}
            onSecondaryPress={() => {}}
          />
        </View>

        <AuthBlock
          title="Connexion"
          subtitle="Connectez-vous pour demander une intervention."
          primaryLabel="Connexion"
          secondaryLabel="Créer un compte"
          footerText="En continuant, vous acceptez les conditions Pro24Home."
          onPrimaryPress={() => {}}
          onSecondaryPress={() => {}}
        >
          <PhoneInput label="Téléphone" placeholder="+33 6 00 00 00 00" />
          <PasswordInput label="Mot de passe" placeholder="••••••••" />
        </AuthBlock>

        <FormStepBlock
          title="Décrivez votre problème"
          description="Ajoutez une description claire pour aider le professionnel."
          current={2}
          total={5}
          primaryLabel="Continuer"
          secondaryLabel="Retour"
          onPrimaryPress={() => {}}
          onSecondaryPress={() => {}}
        >
          <TextInput label="Type de panne" placeholder="Ex : fuite sous évier" />
          <PhotoUploader count={1} max={5} onPress={() => {}} />
        </FormStepBlock>

        <RequestSummaryBlock
          categoryTitle="Plomberie"
          categoryIcon="plumbing"
          problemType="Fuite d’eau"
          description="Fuite visible sous l’évier de la cuisine."
          addressLabel="Nice centre"
          photoCount={2}
          onConfirm={() => {}}
          onEdit={() => {}}
        />

        <QuoteBlock
          professionalName="Karim Benali"
          professionalJob="Plombier"
          eta="12 min"
          distance="4,2 km"
          rating={4.8}
          price="85 €"
          description="Déplacement + diagnostic estimatif."
          onAccept={() => {}}
          onRefuse={() => {}}
        />

        <TrackingBlock
          professionalName="Karim Benali"
          professionalJob="Plombier"
          eta="14 min"
          distance="4,2 km"
          rating={4.8}
          addressLabel="Adresse masquée avant validation"
          onMessagePress={() => {}}
        />

        <EmptyStateBlock
          title="Aucune intervention"
          description="Vos demandes apparaîtront ici."
          actionLabel="Créer une demande"
          onActionPress={() => {}}
        />
      </Section>
    </ScrollView>
  </View>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <AppText variant="h3">{title}</AppText>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing[4], paddingBottom: 80, gap: spacing[6] },
  section: { gap: spacing[3] },
  sectionContent: { gap: spacing[3] },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] },
  iconItem: { width: 76, alignItems: 'center', gap: spacing[1] },
  blockPreview: { height: 620, borderWidth: 1, borderColor: colors.stroke, overflow: 'hidden', borderRadius: 24 },
});
