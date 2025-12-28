<template>
    <h3>你按了 {{num}} 個讚</h3>
    <div class="container">
        <PracticeCard v-for="(pokemon,idx) in pokemons" :key="idx" :image="pokemon.image" :text="pokemon.text" @toggle="onGoodToggle"></PracticeCard>
    </div>
</template>

<script setup>
    import { ref,reactive } from 'vue';
    import PracticeCard from './components/PracticeCard.vue';
    const pokemons=reactive([
        {
            image:'https://tw.portal-pokemon.com/play/resources/pokedex/img/pm/af9b687d23dbe6c6c9d2bf77b099de1a2ed22a09.png',
            text:'咩利羊',
        },
        {
            image:'https://tw.portal-pokemon.com/play/resources/pokedex/img/pm/da7b76fa5088c88d99b8d1c55ca7d3a670fcd9a4.png',
            text:'茸茸羊',
        },
        {
            image:'https://tw.portal-pokemon.com/play/resources/pokedex/img/pm/51eb2421ee1151aeab3ea709e5011f5746aa133e.png',
            text:'電龍',
        },
        {
            image:'https://tw.portal-pokemon.com/play/resources/pokedex/img/pm/0939e1f03014073fe58f5b80c3222ffc8592f5e0.png',
            text:'超級電龍',
        }
    ])

    const num=ref(0)
    const onGoodToggle=(value)=>{
        num.value+=value?1:-1
    }

</script>
<style scoped>
    h3{
        text-align: center;
    }
    .container{
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
    }
</style>