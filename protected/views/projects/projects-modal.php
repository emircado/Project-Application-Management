<?php
    $roles  = [];
?>
<div id="projects-modal" class="dialog-box module" style="display: none;">
    <div class="dialog-container">
        <div class="dialog-content">
            <form action="">
                <div class="dialog-header-block">
                    <h3>Create User</h3>
                    <a href="#" class="close-dialog" id="close-modal" title="Close"><span class="icon"></span></a>
                </div>
                
                <div class="dialog-content-block">
                    <div class="form module">
                        <fieldset>
                            <div class="field field-text">
                                <div class="field-secondary"><label>User Name</label></div>
                                <div class="field-primary">
                                    <div class="pseudo-field">
                                        <input id="modal-username" type="text" class="text add-text"></input>
                                        <span id="modal-username-error" class="error-message" style="display: none;">Cannot be empty.</span>
                                    </div><!-- End Psuedo Field -->
                                </div><!-- End Field Primary -->
                            </div>
                            <div class="field field-text field-modal-name">
                                <div class="field-secondary"><label>Name</label></div>
                                <div class="field-primary">
                                    <div class="pseudo-field">
                                        <input class="text add-text" type="text" id="modal-name"></input>
                                        <span id="modal-name-error" class="error-message" style="display: none;"></span>
                                    </div><!-- End Psuedo Field -->
                                </div><!-- End Field Primary -->
                            </div>
                            <div class="field field-text field-modal-user-role">
                                <div class="field-secondary"><label>User Role</label></div>
                                <div class="field-primary">
                                    <div class="pseudo-field pseudo-field-select" style="width: 125px;">
                                        <select class="select" name="user-role" id="user-role">
                                            <?php
                                                foreach($roles as $key => $value)
                                                {
                                                    ?>
                                                    <option value="<?= $key ?>"><?= $value ?></option>
                                                    <?php
                                                }
                                            ?>
                                        </select>
                                    </div><!-- End Psuedo Field -->
                                </div><!-- End Field Primary -->
                            </div>
                            <div class="field field-text field-modal-email">
                                <div class="field-secondary"><label>Email</label></div>
                                <div class="field-primary">
                                    <div class="pseudo-field">
                                        <input class="text add-text" type="text" id="modal-email"></input>
                                        <span id="modal-email-error" class="error-message" style="display: none;"></span>
                                    </div><!-- End Psuedo Field -->
                                </div><!-- End Field Primary -->
                            </div>
                            <div class="field field-text field-modal-mobile">
                                <div class="field-secondary"><label>Mobile Number</label></div>
                                <div class="field-primary">
                                    <div class="pseudo-field">
                                        <input class="text add-text" type="text" id="modal-mobile"></input>
                                        <span id="modal-mobile-error" class="error-message" style="display: none;"></span>
                                    </div><!-- End Psuedo Field -->
                                </div><!-- End Field Primary -->
                            </div>
                            <div class="field field-text field-modal-password">
                                <div class="field-secondary"><label>Password</label></div>
                                <div class="field-primary">
                                    <div class="pseudo-field">
                                        <input class="text add-text" type="password" id="modal-password"></input>
                                        <span id="modal-password-error" class="error-message" style="display: none;"></span>
                                    </div><!-- End Psuedo Field -->
                                </div><!-- End Field Primary -->
                            </div>
                            <div class="field field-text field-modal-re-password">
                                <div class="field-secondary"><label>Retype Password</label></div>
                                <div class="field-primary">
                                    <div class="pseudo-field">
                                        <input class="text add-text" type="password" id="modal-re-password"></input>
                                        <span id="modal-re-password-error" class="error-message" style="display: none;"></span>
                                    </div><!-- End Psuedo Field -->
                                </div><!-- End Field Primary -->
                            </div>
                            <div class="dialog-footer-block">
                                <div class="field field-text">
                                    <div class="field-action-content">
                                        <div class="pseudo-field pseudo-button">
                                            <a id="button-cancel-modal" class="cancel" href="#">Cancel</a>
                                        </div>
                                        <div class="pseudo-field pseudo-button primary-button">
                                            <button id="button-create-user">Create</button>
                                        </div>
                                    </div><!-- End Field Action Content -->
                                </div><!-- End Field Action -->
                            </div><!-- End UI Dialog Footer Block -->
                        </fieldset>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>