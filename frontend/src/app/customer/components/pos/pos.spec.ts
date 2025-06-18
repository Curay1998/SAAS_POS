import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonToggleGroupHarness, MatButtonToggleHarness } from '@angular/material/button-toggle/testing';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatListItemHarness } from '@angular/material/list/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';


import { PosComponent } from './pos';
// Import specific Material modules that PosComponent imports standalone
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

// Mock data similar to what's in the component
const mockCategories = [
  { id: 1, name: 'Beverages' },
  { id: 2, name: 'Snacks' }
];
const mockProducts = [
  { id: 101, name: 'Coffee', price: 2.50, categoryId: 1, imageUrl: 'coffee.jpg' },
  { id: 102, name: 'Tea', price: 2.00, categoryId: 1, imageUrl: 'tea.jpg' },
  { id: 201, name: 'Chips', price: 1.50, categoryId: 2, imageUrl: 'chips.jpg' }
];

describe('PosComponent', () => {
  let component: PosComponent;
  let fixture: ComponentFixture<PosComponent>;
  let loader: HarnessLoader;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
        CommonModule,
        MatToolbarModule, MatIconModule, MatButtonModule, MatButtonToggleModule,
        MatCardModule, MatRippleModule, MatListModule, MatFormFieldModule,
        MatInputModule, MatDividerModule,
        PosComponent // Import standalone component
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    // Override with mock data for consistent testing
    component.categories = [...mockCategories];
    component.products = [...mockProducts];
    component.ngOnInit(); // Manually trigger ngOnInit to apply mock data
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product categories in mat-button-toggle-group', async () => {
    const toggleGroup = await loader.getHarness(MatButtonToggleGroupHarness);
    expect(toggleGroup).toBeTruthy();
    const toggles = await toggleGroup.getToggles();
    // Expect All Products + number of mock categories
    expect(toggles.length).toBe(mockCategories.length + 1);
    expect(await toggles[0].getText()).toBe('All Products');
    expect(await toggles[1].getText()).toBe('Beverages');
  });

  it('should filter products when a category is selected', async () => {
    const toggleGroup = await loader.getHarness(MatButtonToggleGroupHarness);
    const categoryToggles = await toggleGroup.getToggles({ text: 'Beverages' });
    await categoryToggles[0].check(); // Select 'Beverages'
    fixture.detectChanges();

    expect(component.selectedCategoryId).toBe(1);
    expect(component.filteredProducts.length).toBe(2); // Coffee, Tea
    const productCards = await loader.getAllHarnesses(MatCardHarness.with({ ancestor: '.product-grid' }));
    expect(productCards.length).toBe(2);
  });

  it('should display all products when "All Products" is selected', async () => {
    // First select a category, then "All Products"
    let toggleGroup = await loader.getHarness(MatButtonToggleGroupHarness);
    let categoryToggles = await toggleGroup.getToggles({ text: 'Beverages' });
    await categoryToggles[0].check();
    fixture.detectChanges();


    toggleGroup = await loader.getHarness(MatButtonToggleGroupHarness);
    categoryToggles = await toggleGroup.getToggles({ text: 'All Products' });
    await categoryToggles[0].check();
    fixture.detectChanges();

    expect(component.selectedCategoryId).toBeNull();
    expect(component.filteredProducts.length).toBe(mockProducts.length);
  });


  it('should add product to cart when a product card is clicked', async () => {
    const productCards = await loader.getAllHarnesses(MatCardHarness.with({ ancestor: '.product-grid' }));
    expect(component.cart.length).toBe(0);
    await productCards[0].host().then(host => host.click()); // Click first product (Coffee)
    fixture.detectChanges();

    expect(component.cart.length).toBe(1);
    expect(component.cart[0].productName).toBe('Coffee');
    expect(component.cartTotal).toBe(2.50);
  });

  it('should display cart items in mat-list', async () => {
    component.addToCart(mockProducts[0]); // Add Coffee
    component.addToCart(mockProducts[2]); // Add Chips
    fixture.detectChanges();

    const listItems = await loader.getAllHarnesses(MatListItemHarness.with({ ancestor: '.cart-summary-card' }));
    expect(listItems.length).toBe(2);
    expect(await listItems[0].getText()).toContain('Coffee');
    expect(await listItems[1].getText()).toContain('Chips');
  });

  it('should update quantity from input field in cart', async () => {
    component.addToCart(mockProducts[0]); // Add Coffee
    fixture.detectChanges();

    const quantityInput = await loader.getHarness(MatInputHarness.with({ ancestor: '.cart-item' }));
    await quantityInput.setValue('3');
    fixture.detectChanges(); // Let component react to input event

    expect(component.cart[0].quantity).toBe(3);
    expect(component.cart[0].total).toBe(2.50 * 3);
    expect(component.cartTotal).toBe(7.50);
  });


  it('should remove item from cart when remove button is clicked', async () => {
    component.addToCart(mockProducts[0]); // Coffee
    component.addToCart(mockProducts[1]); // Tea
    fixture.detectChanges();
    expect(component.cart.length).toBe(2);

    const removeButtons = await loader.getAllHarnesses(MatIconHarness.with({selector: '.remove-item-button mat-icon'}));
    expect(removeButtons.length).toBe(2);

    // Click the remove button for the first item (Coffee)
    // To get the button harness, we need to be more specific or get all buttons and click the first one
    const firstRemoveButton = await loader.getHarness(MatButtonHarness.with({selector: '.remove-item-button'}));
    await firstRemoveButton.click();
    fixture.detectChanges();

    expect(component.cart.length).toBe(1);
    expect(component.cart[0].productName).toBe('Tea'); // Coffee removed, Tea remains
    expect(component.cartTotal).toBe(2.00);
  });


  it('should calculate cart total correctly', () => {
    component.addToCart(mockProducts[0]); // Coffee 2.50
    component.addToCart(mockProducts[2]); // Chips 1.50
    component.updateQuantity(mockProducts[0].id, 2); // Coffee x2 = 5.00
    fixture.detectChanges();
    expect(component.cartTotal).toBe(5.00 + 1.50); // 6.50
  });

  it('should perform checkout and clear cart', async () => {
    spyOn(window, 'alert'); // Mock alert
    component.addToCart(mockProducts[0]);
    fixture.detectChanges();

    const checkoutButton = await loader.getHarness(MatButtonHarness.with({ text: 'Proceed to Checkout' }));
    await checkoutButton.click();

    expect(window.alert).toHaveBeenCalledWith(jasmine.stringMatching(/Checkout initiated! Total: \$2.50/));
    expect(component.cart.length).toBe(0);
    expect(component.cartTotal).toBe(0);
  });

  it('checkout button should be disabled if cart is empty', async () => {
     fixture.detectChanges(); // Ensure cart is initially empty
     const checkoutButton = await loader.getHarness(MatButtonHarness.with({ text: 'Proceed to Checkout' }));
     expect(await checkoutButton.isDisabled()).toBeTrue();

     component.addToCart(mockProducts[0]);
     fixture.detectChanges();
     expect(await checkoutButton.isDisabled()).toBeFalse();
  });

  it('should have a link to settings in the toolbar', async () => {
    const settingsButton = await loader.getHarness(MatButtonHarness.with({ text: 'Settings' }));
    expect(settingsButton).toBeTruthy();
    const icon = await settingsButton.getHarnessOrNull(MatIconHarness.with({name: 'settings'}));
    expect(icon).toBeTruthy();
    // Further check routerLink if needed, though harness doesn't directly expose it
  });

  it('should display "No products found" message when filteredProducts is empty', async () => {
    component.filteredProducts = [];
    fixture.detectChanges();
    const noProductsMessage = fixture.debugElement.query(By.css('.empty-state-message p'));
    expect(noProductsMessage.nativeElement.textContent).toContain('No products found');
  });

  it('should display "Your cart is empty" message when cart is empty', async () => {
    component.cart = [];
    fixture.detectChanges();
    const emptyCartMessage = fixture.debugElement.query(By.css('.cart-summary-card .empty-state-message p'));
    expect(emptyCartMessage.nativeElement.textContent).toContain('Your cart is empty');
  });

});
