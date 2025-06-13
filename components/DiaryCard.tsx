import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { DiaryEntry } from '@/types/diary';
import { useThemeColors } from '@/hooks/useColorScheme';
import { Calendar, Camera } from 'lucide-react-native';

interface DiaryCardProps {
  entry: DiaryEntry;
  searchQuery?: string;
}

const { width } = Dimensions.get('window');

export function DiaryCard({ entry, searchQuery }: DiaryCardProps) {
  const colors = useThemeColors();

  const handlePress = () => {
    router.push(`/entry/${entry.id}`);
  };

  const highlightText = (text: string, query?: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => (
      <Text
        key={index}
        style={[
          part.toLowerCase() === query.toLowerCase() && {
            backgroundColor: colors.tertiary,
            color: colors.onTertiary,
          }
        ]}
      >
        {part}
      </Text>
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    date: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      marginLeft: 6,
    },
    photoIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    photoCount: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      marginLeft: 4,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.onSurface,
      marginBottom: 8,
      lineHeight: 24,
    },
    content: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      lineHeight: 20,
      marginBottom: 12,
    },
    photoPreview: {
      height: 120,
      borderRadius: 12,
      marginTop: 8,
    },
    photoGrid: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
    },
    photoGridItem: {
      flex: 1,
      height: 80,
      borderRadius: 8,
    },
    morePhotos: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      top: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    morePhotosText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color={colors.onSurfaceVariant} />
          <Text style={styles.date}>{formatDate(entry.date)}</Text>
        </View>
        {entry.photos.length > 0 && (
          <View style={styles.photoIndicator}>
            <Camera size={16} color={colors.onSurfaceVariant} />
            <Text style={styles.photoCount}>{entry.photos.length}</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>
        {highlightText(entry.title, searchQuery)}
      </Text>

      <Text style={styles.content} numberOfLines={3}>
        {highlightText(entry.content, searchQuery)}
      </Text>

      {entry.photos.length > 0 && (
        <View>
          {entry.photos.length === 1 ? (
            <Image
              source={{ uri: entry.photos[0] }}
              style={styles.photoPreview}
              contentFit="cover"
            />
          ) : (
            <View style={styles.photoGrid}>
              {entry.photos.slice(0, 3).map((photo, index) => (
                <View key={index} style={{ flex: 1 }}>
                  <Image
                    source={{ uri: photo }}
                    style={styles.photoGridItem}
                    contentFit="cover"
                  />
                  {index === 2 && entry.photos.length > 3 && (
                    <View style={styles.morePhotos}>
                      <Text style={styles.morePhotosText}>
                        +{entry.photos.length - 3}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}