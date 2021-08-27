import React, { useState } from 'react';
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import uuid from 'react-native-uuid';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';

import { CategorySelect } from '../../components/CategorySelect';
import { Background } from '../../components/Background';
import { Header } from '../../components/Header';
import { SmallInput } from '../../components/SmallInput';
import { TextArea } from '../../components/TextArea';
import { Button } from '../../components/Button';
import { ModalView } from '../../components/ModalView';
import { GuildProps } from '../../components/Guild';
import { GuildIcon } from '../../components/GuildIcon';
import { Guilds } from '../Guilds'

import { COLLECTION_APPOINTMENTS } from '../../configs/database';
import { theme } from '../../global/styles/theme';
import { styles } from './styles';

export function AppointmentCreate() {
  const [category, setCategory] = useState('');
  const [openModalGuilds, setOpenModalGuilds] = useState(false);
  const [guild, setGuild] = useState<GuildProps>({} as GuildProps);

  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  function handleOpenGuilds() {
    setOpenModalGuilds(true);
  }

  function handleCloseGuilds() {
    setOpenModalGuilds(false);
  }

  function handleGuildSelect(guildSelected: GuildProps) {
    setGuild(guildSelected);
    setOpenModalGuilds(false);
  }

  function handleCategorySelect(categoryId: string) {
    setCategory(categoryId);
  }

  async function handleSave() {
    const newAppointment = {
      id: uuid.v4(),
      guild,
      category,
      date: `${day}/${month} às ${hour}:${minute}h`,
      description
    }

    const storage = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
    const appointments = storage ? JSON.parse(storage) : [];

    await AsyncStorage.setItem(COLLECTION_APPOINTMENTS, JSON.stringify([...appointments, newAppointment]));

    navigation.navigate('Home');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Background>
        <ScrollView>
          <Header
            title="Agendar partida"
          />

          <Text style={[
            styles.label,
            { marginLeft: 24, marginTop: 36, marginBottom: 18 }]}
          >
            Categoria
          </Text>

          <CategorySelect
            hasCheckBox
            setCategory={handleCategorySelect}
            categorySelected={category}
          />

          <View style={styles.form}>
            <RectButton onPress={handleOpenGuilds}>
              <View style={styles.select}>
                {
                  guild.icon ? <GuildIcon guildId={guild.id} iconId={guild.icon} /> : <View style={styles.image} />
                }

                <View style={styles.selectBody}>
                  <Text style={styles.label}>
                    {guild.name ? guild.name : 'Selecione um servidor'}
                  </Text>
                </View>

                <Feather
                  name='chevron-right'
                  size={18}
                  color={theme.colors.heading}
                />

              </View>
            </RectButton>

            <View style={styles.field}>
              <View>
                <Text style={[styles.label, { marginBottom: 10 }]}>
                  Dia e mês
                </Text>

                <View style={styles.column}>
                  <SmallInput
                    onChangeText={setDay}
                    maxLength={2} />
                  <Text style={styles.divider}>
                    /
                  </Text>
                  <SmallInput
                    onChangeText={setMonth}
                    maxLength={2} />
                </View>
              </View>
              <View>
                <Text style={[styles.label, { marginBottom: 10 }]}>
                  Hora e minuto
                </Text>

                <View style={styles.column}>
                  <SmallInput
                    onChangeText={setHour}
                    maxLength={2} />
                  <Text style={styles.divider}>
                    :
                  </Text>
                  <SmallInput
                    onChangeText={setMinute}
                    maxLength={2} />
                </View>
              </View>

            </View>
            <View style={[styles.field, { marginBottom: 12 }]}>
              <Text style={styles.label}>
                Descrição
              </Text>
              <Text style={styles.caracteresLimit}>
                Max 100 caracteres
              </Text>
            </View>
            <TextArea
              onChangeText={setDescription}
              multiline
              maxLength={100}
              numberOfLines={5}
              autoCorrect={false}
            />
            <View style={styles.footer}>
              <Button
              onPress={handleSave}
              title='Agendar' />
            </View>
          </View>
        </ScrollView>
      </Background>

      <ModalView visible={openModalGuilds} closeModal={handleCloseGuilds}>
        <Guilds handleGuildSelect={handleGuildSelect} />
      </ModalView>

    </KeyboardAvoidingView>
  )
}