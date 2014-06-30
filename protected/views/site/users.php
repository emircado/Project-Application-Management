<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name . ' - Users';
?>

<div class="primary">
    <div class="primary-container">
        <div class="primary-content">
            <div id="table" class="module-table module brand-names-table">
                <div class="header-block">
                    <div class="header-block-content">
                        <div class="header-block-title">
                            <h2 class="content-title">Users</h2><hr>
                        </div> 
                        <input type="hidden" id="users-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
				        <div class="table-header-block">
				            <div class="header-block-button">
				                <a id="users-sync-button" class="button round blue image-right ic-add text-upper" href="#">Sync w/ LDAP</a>
				            </div><!-- End Header Block Button -->
				            <div style="float:left;padding:8px;">
					            <span>Last Updated</span>
					            <span id="users-updated">August 1, 2014</span>
				        	</div>
				        </div><!-- End Table Header Block -->
                        <div id="users-lists-container"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

