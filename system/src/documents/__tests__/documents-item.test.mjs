/* eslint-disable no-unused-expressions */
/**
 * @file Contains tests for item documents
 */
import ItemSD from "../ItemSD.mjs";
import { cleanUpItemsByKey, itemTypes } from "../../testing/testUtils.mjs";

export const key = "shadowdark.documents.item";
export const options = {
	displayName: "ShadowDark: Documents: Item",
};

const createMockItem = async type => {
	return ItemSD.create({
		name: `Test Item ${key}: ${type}`,
		type,
	});
};

export default ({ describe, it, after, expect }) => {
	after(() => {
		cleanUpItemsByKey(key);
	});

	describe("Item creation", () => {
		itemTypes.forEach(type => {
			it(`can create ${type} item`, async () => {
				const item = await createMockItem(type);
				expect(item).is.not.undefined;
				await item.delete();
			});
		});
	});

	describe("_preCreate(data, options, user)", () => {
		it("Gem type item has slots correctly configured", async () => {
			const item = await createMockItem("Gem");
			expect(item.system.slots.free_carry).equal(0);
			expect(CONFIG.SHADOWDARK.INVENTORY.GEMS_PER_SLOT).is.not.null;
			expect(item.system.slots.per_slot).equal(CONFIG.SHADOWDARK.INVENTORY.GEMS_PER_SLOT);
			expect(item.system.slots.slots_used).equal(1);
			await item.delete();
		});
	});

	describe("hasProperty(property)", () => {
		it("read a system property correctly", async () => {
			const item = await ItemSD.create({
				name: `Test Item ${key}: Armor`,
				type: "Armor",
				"system.properties": ["Test"],
			});

			expect(item.hasProperty("Test")).equal(true);
			await item.delete();
		});
	});

	describe("isAShield()", () => {
		it("returns true for a shield", async () => {
			const item = await ItemSD.create({
				name: `Test Item ${key}: Armor`,
				type: "Armor",
				"system.properties": ["shield"],
			});
			expect(item.isAShield()).equal(true);
			await item.delete();
		});

		it("returns false for an armor", async () => {
			const item = await ItemSD.create({
				name: `Test Item ${key}: Armor`,
				type: "Armor",
				"system.properties": [],
			});
			expect(item.isAShield()).equal(false);
			await item.delete();
		});
	});

	describe("isNotAShield()", () => {
		it("returns true for a shield", async () => {
			const item = await ItemSD.create({
				name: `Test Item ${key}: Armor`,
				type: "Armor",
				"system.properties": ["shield"],
			});
			expect(item.isNotAShield()).equal(false);
			await item.delete();
		});

		it("returns false for an armor", async () => {
			const item = await ItemSD.create({
				name: `Test Item ${key}: Armor`,
				type: "Armor",
				"system.properties": [],
			});
			expect(item.isNotAShield()).equal(true);
			await item.delete();
		});
	});
};
