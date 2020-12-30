import { computed, reactive } from '@nuxtjs/composition-api';
import { BaseState, Status } from '../interfaces/base-state.interface';
import { User } from '../store/user';

interface UserState extends BaseState {
  user: User | null
  token: string
}

const state = reactive<UserState>({
  status: Status.UNLOADED,
  user: null,
  token: ''
})

const setUser = (user: User) => state.user = user

const isLoggedIn = computed(() => !!state.token)

const avatar = computed(() => state.user ? getAvatar(state.user) : '')


const getAvatar = (user: User) => {
  if (user.discord_avatar) {
    const ext = user.discord_avatar.includes('a_') ? '.gif' : '.png'
    return `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}${ext}`
  }

  return `https://cdn.discordapp.com/embed/avatars/${+user.discord_discriminator % 5}.png`
} 

export default {
  state: reactive(state),
  setUser,
}