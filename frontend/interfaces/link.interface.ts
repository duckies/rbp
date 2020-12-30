export interface Link {
  icon?: string
  title: string
  to?: string
  lower?: string
  submenu?: Link[]
  href?: string
  target?: string
  rel?: string
}
