<template>
	<div style="width:100%; height: 100%;">
		
		<v-img :src="img" alt="image uploaded" 
			height="300" width="100%"
			class="grey"
			style="position: fixed; top: 0; left: 0; z-index: -1;"
		/>

		<div style="width:100%; height: 280px;" class="d-flex justify-center align-center">
			<v-btn icon x-large color="primary" @click="$refs.inputUpload.click()">
				<v-icon>mdi-camera</v-icon>
			</v-btn>
			<v-btn icon x-large color="primary" class="ml-4" v-if="img != ''" @click="resetFiles">
				<v-icon>mdi-close</v-icon>
			</v-btn>
			<input type="file" style="display:none" accept="image/*" ref="inputUpload" @input="uploadFiles">
		</div>

		<v-sheet color="primary" class="pa-8 rounded-t-xl" style="height: calc(100% - 280px);">
			<v-sheet max-width="600px" class="transparent mx-auto">
			<h2 class="text-center mb-8 headline secondary--text">
				Ajouter une activité
			</h2>

			<v-form @submit.prevent="createActivity" v-model="valid" class="text-center">
				<v-text-field v-model="activity.name" label="Nom" 
					:rules="nameRules" required 
					color="accent" clearable>
				</v-text-field>

				<v-textarea v-model="activity.description" label="Description"
					:rules="descriptionRules" required 				
					color="accent" auto-grow clearable>
				</v-textarea>

				<v-autocomplete v-model="activity.tags" item-value="id" item-text="name" :items="tags" label="Catégories"
					chips deletable-chips multiple
					color="accent" item-color="accent">
				</v-autocomplete>

				<v-text-field v-model="activity.website" label="Lien (facultatif)" 
					prepend-inner-icon="mdi-link-variant"
					hint="www.example.com/page" persistent-hint 
					color="accent">
				</v-text-field>

				<PositionField v-model="activity" style="margin-top: 70px"></PositionField>

				<ul class="warning--text body-2 mb-0 mt-8">
					<li v-for="(value, index) in errors" :key="index">{{ index }} : {{ value }}</li>
				</ul>
			
				<v-btn :disabled="!valid" type="submit"
					rounded color="accent" elevation="0" class="my-8">
					Enregistrer
				</v-btn>
			</v-form>
			</v-sheet>
		</v-sheet>
	</div>
</template>

<script>
import PositionField from '@/components/activities/PositionField.vue'

export default {
	components:
	{
		PositionField,
	},

	name: "ActivityCreate",
	data() {
		return {

			activity:
			{
				name: "",
				description: "",
				tags: [],
				website: "",
				latitude: 47.053011,
				longitude: 7.067925,
				image: null,
			},

			img: "",
			nameRules: [
				v => !!v || "Nom requis",
			],
			descriptionRules: [
				v => !!v || "Description requise",
			],
			tags: [],
			valid: false,
			errors: [],
		}
	},

	mounted()
	{
		this.fetchTags();
	},

	methods:
	{
		async fetchTags()
		{
			try
			{
				var response = await this.$store.dispatch("fetchTags");
				this.tags = response.data;
			}
			catch(error)
			{
				//Empty
			}
		},

		async createActivity()
		{
			try
			{
				console.log(this.activity.tags)
				var response = await this.$store.dispatch("createActivity", {
					creator: this.$store.state.user.id,
					name: this.activity.name,
					description: this.activity.description,
					longitude: this.activity.longitude,
					latitude: this.activity.latitude,
					website: this.activity.website,
					tags: this.activity.tags,
					image: this.activity.image,
				});

				this.$router.replace({name: 'ActivityDetails', params: { id: response.data.id }})
			}
			catch(error)
			{
				this.errors = error.response.data;
			}
		},

		resetFiles()
		{
			this.activity.image = null;
			this.$refs.inputUpload.value = '';
			this.img = "";
		},
		
		uploadFiles(e) {
			if (e.target.files && e.target.files[0]) {
				this.activity.image = e.target.files[0];
				this.img= URL.createObjectURL(this.activity.image);
			}
		},
	}
}
</script>

<style>

</style>