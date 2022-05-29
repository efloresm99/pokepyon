/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IPokemon } from 'pokeapi-typescript';
import * as sharp from 'sharp';

@Injectable()
export class QuestionsService {
  async getQuestion() {
    const randomId = Math.ceil(Math.random() * 125);

    const pokeApi = require('pokeapi-typescript');
    const pokemon: IPokemon = await pokeApi.Pokemon.resolve(randomId);
    const pokeImageUrl = pokemon.sprites.front_default;
    const pokemonImage = await this.getImage(pokeImageUrl);
    const pokemonType = await this.getPokemonTypeSpanish(pokemon);
    const pokemonMove = await this.getPokemonMoveSpanish(pokemon);
    const pokemonName = pokemon.name.toLowerCase();
    console.log(pokemonName, pokemonType, pokemonMove);
    return pokemonImage;
  }

  private async getImage(imageUrl: string) {
    const image = (await axios({ url: imageUrl, responseType: 'arraybuffer' }))
      .data as Buffer;
    const background = (
      await axios({
        url: process.env.BACKGROUND_URL,
        responseType: 'arraybuffer',
      })
    ).data as Buffer;
    const processedImage = await sharp(image)
      .resize(null, 180)
      .threshold(255)
      .linear(0, 0)
      .toBuffer();
    const finalImage = sharp(background)
      .composite([{ input: processedImage, top: 40, left: 40 }])
      .toBuffer();
    return finalImage;
  }

  private async getPokemonTypeSpanish(pokemon: IPokemon) {
    const typeEngUrl = pokemon.types[0].type.url;
    const typeInfo = await (
      await axios({ url: typeEngUrl, responseType: 'json' })
    ).data;
    const typeEs = typeInfo.names.filter(
      (type) => type.language.name === 'es',
    )[0].name;
    return typeEs;
  }

  private async getPokemonMoveSpanish(pokemon: IPokemon) {
    const moveUrl = pokemon.moves[0].move.url;
    const moveData = await (
      await axios({ url: moveUrl, responseType: 'json' })
    ).data;
    const moveEs = moveData.names.filter(
      (move) => move.language.name === 'es',
    )[0].name;
    return moveEs;
  }
}
